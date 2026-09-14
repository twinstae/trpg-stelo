#!/usr/bin/env python3
"""플레이킷 인플레이스 한국어 치환기.

원본 PDF의 텍스트만 지우고(그래픽·표 격자·아트 보존) 같은 자리에 한국어를 다시 앉힌다.
* p3~7: 액션 제목 + 본문 블록 단위 재조판. 표는 격자선에서 행/열을 복원해 셀 단위로 채운다.
* p1·p2·p8·p9·p10: 라벨 단위 치환.
* 어떤 블록이 안 들어가면 아래 여백을 먼저 흡수하고, 그래도 안 되면 크기를 조금 줄인다(보고서에 기록).

실행:
    uv run --no-project --with pymupdf --with fonttools python scripts/playkit-ko/apply.py
    (fonttools는 제목·라벨용 굵은 폰트 인스턴싱에만 쓰인다. 없으면 그냥 보통 굵기로 진행한다.)
결과:
    Ironsworn-Playkit-KO.pdf           (완성본, 저장소 루트)
    .freebuff/playkit/fit-report.json  (블록별 조정·미번역 내역)

원문 Ironsworn Playkit © Shawn Tomkin, CC BY-NC-SA 4.0. 이 번역도 같은 조건.
"""
from __future__ import annotations

import json
import os
import pathlib
import sys

import pymupdf

from extract import COLUMN_SPLIT, font_class, line_list

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "Ironsworn-Playkit.pdf"
OUT = ROOT / "Ironsworn-Playkit-KO.pdf"
CONTENT = pathlib.Path(__file__).resolve().parent / "content.json"
REPORT = ROOT / ".freebuff" / "playkit" / "fit-report.json"

# 한글 폰트 후보(첫 번째로 존재하는 것 사용). 환경변수로 덮어쓸 수 있다.
FONT_CANDIDATES = [
    os.environ.get("PLAYKIT_KO_FONT", ""),
    str(pathlib.Path.home() / "Library/Fonts/PretendardVariable.ttf"),
    "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
    "/Library/Fonts/NotoSansKR-Regular.ttf",
]
LEADING = 1.2  # 원본 행간 비율(9pt 본문 → 10.8pt). 원본 조판 실측값.
MIN_SCALE = 0.86  # 이보다 더 줄여야 하면 사람이 손대도록 보고한다.
PAD = 1.2
CELL_PAD = 0.6
BOLD_WEIGHT = 700  # 가변폰트에서 뽑아 쓸 굵기(ModestoPoster/Expanded 대응).


def pick_font() -> str:
    for cand in FONT_CANDIDATES:
        if cand and pathlib.Path(cand).exists():
            return cand
    sys.exit("한글 폰트를 찾지 못했습니다. PLAYKIT_KO_FONT로 지정하십시오.")


def ensure_bold_font(fontfile: str) -> str:
    """가변 한글 폰트에서 제목·라벨용 굵은 정적 인스턴스를 뽑아 캐시한다.

    가변축(wght)이 없는 폰트(AppleGothic 등 폴백)면 그냥 원본을 돌려준다 —
    이 기기에는 굵기별 정적 한글 폰트가 따로 없기 때문에, 유일한 방법은
    Pretendard Variable의 wght 축을 인스턴싱하는 것뿐이다.
    """
    src = pathlib.Path(fontfile)
    cache_dir = pathlib.Path(__file__).resolve().parent / "fonts"
    out_path = cache_dir / f"{src.stem}-wght{BOLD_WEIGHT}.ttf"
    if out_path.exists() and out_path.stat().st_mtime >= src.stat().st_mtime:
        return str(out_path)
    try:
        from fontTools.ttLib import TTFont
        from fontTools.varLib.instancer import instantiateVariableFont
    except ImportError:
        return fontfile
    f = TTFont(fontfile)
    if "fvar" not in f:
        return fontfile
    instantiateVariableFont(f, {"wght": BOLD_WEIGHT}, inplace=True)
    cache_dir.mkdir(parents=True, exist_ok=True)
    f.save(out_path)
    return str(out_path)


def checkbox_pairs(page: pymupdf.Page) -> list[dict]:
    """체크박스 글리프(사설영역 PUA) span과 바로 뒤 라벨 span을 짝짓는다.

    원본 Wingdings 글리프는 이 폰트로는 복원할 수 없어(심볼 cmap이라 MuPDF가
    유니코드로 못 찾는다) 대신 같은 자리·크기에 원과 같은 벡터 동그라미를
    그린다(원본 자형이 실제로 속이 빈 동그라미다).
    """
    pairs = []
    for block in page.get_text("rawdict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            spans = line["spans"]
            for i, sp in enumerate(spans):
                txt = "".join(c["c"] for c in sp["chars"])
                if not txt or not all(0xE000 <= ord(ch) <= 0xF8FF for ch in txt):
                    continue
                nxt = spans[i + 1] if i + 1 < len(spans) else None
                word = "".join(c["c"] for c in nxt["chars"]).strip() if nxt else ""
                pairs.append(
                    {
                        "box_bbox": pymupdf.Rect(sp["bbox"]),
                        "word": word,
                        "word_bbox": pymupdf.Rect(nxt["bbox"]) if nxt else None,
                        "size": round(nxt["size"], 2) if nxt else 9.0,
                    }
                )
    return pairs


def merge_wrapped_labels(lines: list[dict], labels: dict[str, str]) -> list[dict]:
    """두 줄로 접힌 라벨("mark 2" + "progress" 등)을 한 줄로 합친다.

    좁은 칸에서 줄바꿈된 라벨은 사전에 합쳐진 문구로만 있어 그대로는 매치되지
    않는다. 같은 x시작에서 바로 아래(8pt 이내) 줄과 합쳐 봐서 합쳐진 문구가
    사전에 있으면 하나의 줄로 만든다. 같은 x시작 줄끼리는 페이지 전체를 훑어
    찾는다(2열 이상인 쪽에서는 정렬 순서상 서로 떨어져 있을 수 있어서다).
    """
    consumed: set[int] = set()
    merges: dict[int, dict] = {}
    for i, ln in enumerate(lines):
        if i in consumed:
            continue
        best_j = None
        for j, cand in enumerate(lines):
            if j == i or j in consumed:
                continue
            same_col = abs(cand["bbox"][0] - ln["bbox"][0]) < 3
            close = -4 <= cand["bbox"][1] - ln["bbox"][3] <= 8
            if same_col and close:
                combined = norm(ln["text"] + " " + cand["text"])
                if combined in labels:
                    best_j = j
                    break
        if best_j is not None:
            nxt = lines[best_j]
            merged = dict(ln)
            merged["text"] = norm(ln["text"] + " " + nxt["text"])
            merged["bbox"] = [
                min(ln["bbox"][0], nxt["bbox"][0]),
                ln["bbox"][1],
                max(ln["bbox"][2], nxt["bbox"][2]),
                nxt["bbox"][3],
            ]
            merges[i] = merged
            consumed.add(best_j)
    out = []
    for i, ln in enumerate(lines):
        if i in merges:
            out.append(merges[i])
        elif i not in consumed:
            out.append(ln)
    return out


def style_of(ln: dict) -> dict:
    weight = "bold" if font_class(ln["font"]) == "display" else "regular"
    return {"weight": weight, "color": tuple(ln.get("color", (0, 0, 0)))}


def norm(text: str) -> str:
    return " ".join(text.replace("\u2019", "’").split())


def wrap_lines(text: str, font: pymupdf.Font, size: float, width: float) -> list[str]:
    """주어진 폭에 맞춰 줄을 나눈다(공백 우선, 긴 토큰은 글자 단위)."""
    out: list[str] = []
    for raw in text.split("\n"):
        if not raw.strip():
            continue
        words = raw.split(" ")
        cur = ""
        for w in words:
            trial = w if not cur else cur + " " + w
            if font.text_length(trial, size) <= width or not cur:
                if font.text_length(trial, size) <= width:
                    cur = trial
                    continue
                # 토큰 하나가 폭을 넘으면 글자 단위로 자른다
                for ch in trial:
                    if font.text_length(cur + ch, size) <= width:
                        cur += ch
                    else:
                        out.append(cur)
                        cur = ch
            else:
                out.append(cur)
                cur = w
        if cur:
            out.append(cur)
    return out


def needed_height(text: str, font: pymupdf.Font, size: float, width: float, leading: float = LEADING) -> float:
    return len(wrap_lines(text, font, size, width)) * size * leading


def translate_line(text: str, labels: dict[str, str]) -> str | None:
    """한 줄을 낱말 단위로 번역한다(체크박스가 없는 일반 라벨 줄만 대상).

    체크박스가 섞인 줄은 checkbox_pairs()로 먼저 가로채 처리하므로
    여기서는 순수 텍스트 낱말만 사전에서 찾는다.
    """
    out: list[str] = []
    hit = False
    for tok in norm(text).split(" "):
        if tok in labels:
            out.append(labels[tok])
            hit = True
        else:
            return None  # 모르는 낱말이 섞이면 이 줄은 건드리지 않는다
    return " ".join(out) if hit else None


def is_rotated(ln: dict) -> bool:
    d = ln.get("dir", (1.0, 0.0))
    return abs(d[0]) < 0.5


def rotated_label_box(ln: dict, page: pymupdf.Page | None = None) -> pymupdf.Rect:
    """세로로 눕힌 라벨(MOMENTUM/STATUS 등)의 상자.

    줄 bbox는 (좁은 폭 × 긴 높이)로 뒤집혀 있다 — 폭이 곧 폰트 크기 방향이라
    가로쓰기 상자의 위아래 패딩과 같은 비율로 좌우를 넓혀 준다. STATUS처럼 옆에
    바로 다른 도형(칸)이 붙어 있으면 그 경계를 넘지 않도록 패딩을 깎는다.
    """
    x0, y0, x1, y1 = ln["bbox"]
    size = ln["size"]
    left = x0 - 0.32 * size
    right = x1 + 0.45 * size
    if page is not None:
        y_mid = (y0 + y1) / 2
        for d in page.get_drawings():
            r = d["rect"]
            if r.width <= 0 or r.height <= 0 or r.width > 200 or r.height > 200:
                continue  # 큰 배경 도형(산 실루엣 등)은 제외
            if not (r.y0 - 2 <= y_mid <= r.y1 + 2):
                continue
            if x1 - 1 <= r.x0 < right:
                right = min(right, r.x0 - 1.5)
            if left < r.x1 <= x0 + 1:
                left = max(left, r.x1 + 1.5)
    return pymupdf.Rect(left, y0 - 1, right, y1 + 1)


def enclosing_cell(page: pymupdf.Page, bbox, max_dim: float = 150.0) -> pymupdf.Rect | None:
    """라벨을 담고 있는 작은 색상 상자/칸(능력치 칸, HEALTH 검은 띠, MAX 회색 칸 등)을 찾는다.

    원본은 이런 칸 안에서 라벨을 가운데 정렬한다. 원문 낱말이 길 때는 왼쪽 끝
    좌표를 그대로 써도 어차피 칸을 거의 채워 티가 안 났지만, 한글이 짧아지면
    왼쪽에 쏠려 보인다. 페이지 제목 띠처럼 아주 넓은 도형(원래도 왼쪽 정렬)은
    max_dim으로 걸러 건드리지 않는다.
    """
    lr = pymupdf.Rect(bbox)
    best = None
    for d in page.get_drawings():
        r = d["rect"]
        if r.width <= 0 or r.height <= 0 or r.width > max_dim or r.height > max_dim:
            continue
        pad = 1.5
        if not (r.x0 - pad <= lr.x0 and lr.x1 <= r.x1 + pad and r.y0 - pad <= lr.y0 and lr.y1 <= r.y1 + pad):
            continue
        if best is None or r.width * r.height < best.width * best.height:
            best = r
    return best


def label_box(
    ln: dict, page: pymupdf.Page | None = None, page_width: float = 612.0, wide: bool = False
) -> tuple[pymupdf.Rect, int]:
    """라벨용 상자.

    줄 bbox는 글리프에 딱 붙어 있어 그대로 쓰면 한 줄도 안 들어간다. 위아래를 조금
    키우고, 가운데 놓인 라벨이면 좌우도 넓혀 가운데 정렬로 되돌린다.
    """
    x0, y0, x1, y1 = ln["bbox"]
    size = ln["size"]
    if page is not None and not wide:
        cell = enclosing_cell(page, ln["bbox"])
        if cell is not None:
            return pymupdf.Rect(cell.x0 + 1, y0 - 0.32 * size, cell.x1 - 1, y1 + 0.45 * size), 1
    cx = (x0 + x1) / 2
    centered = abs(cx - page_width / 2) < 14 or min(abs(cx - 166), abs(cx - 447)) < 12
    if centered:
        # 큰 표지 제목(예: 40pt PLAYKIT)은 비례 패딩이 위 아이콘·장식과 겹치므로 상한을 둔다.
        top_pad = min(0.32 * size, 4.0)
        bot_pad = min(0.45 * size, 10.0)
        rect = pymupdf.Rect(
            max(x0 - 45, 20), y0 - top_pad, min(x1 + 45, page_width - 20), y1 + bot_pad
        )
        return rect, 1
    col_right = 300.0 if x0 < COLUMN_SPLIT else 580.0
    # 제목은 한 줄을 혼자 쓰므로 열 끝까지 넓혀 둔다(한글이 길어져도 안 접히게).
    right = col_right if wide else min(max(x1, x0 + 1.7 * size), col_right)
    return (pymupdf.Rect(x0 - 1, y0 - 0.32 * size, right, y1 + 0.45 * size), 0)


def rules_in(page: pymupdf.Page, x0: float, x1: float, y0: float, y1: float) -> list[tuple[float, float, float]]:
    """영역 안의 가로 규칙선을 (y, x시작, x끝)으로 모은다."""
    found = []
    for d in page.get_drawings():
        for it in d["items"]:
            if it[0] != "l":
                continue
            a, b = it[1], it[2]
            if abs(a.y - b.y) > 0.05:
                continue
            lo, hi = min(a.x, b.x), max(a.x, b.x)
            if not (x0 - 2 <= lo <= x1 + 2 and y0 - 2 <= a.y <= y1 + 2):
                continue
            if hi - lo < 30:  # 자잘한 장식선 제외
                continue
            found.append((round(a.y, 1), round(lo, 1), round(hi, 1)))
    return sorted(set(found))


def table_grid(page, sec_x0: float, sec_x1: float, y0: float, y1: float):
    """섹션 안에서 표 격자를 찾는다. (표 bbox, 행 목록, 열 경계) 또는 None."""
    rules = rules_in(page, sec_x0, sec_x1, y0, y1)
    # 같은 y의 조각들을 합쳐 한 줄로 본다
    by_y: dict[float, tuple[float, float]] = {}
    for y, lo, hi in rules:
        if y in by_y:
            by_y[y] = (min(by_y[y][0], lo), max(by_y[y][1], hi))
        else:
            by_y[y] = (lo, hi)
    ys = sorted(by_y)
    if len(ys) < 3:
        return None
    # 규칙선 간격이 일정한 구간만 표로 인정(간격이 크게 벌어지면 별개 표)
    runs: list[list[float]] = [[ys[0]]]
    for a, b in zip(ys, ys[1:]):
        if b - a <= 60:
            runs[-1].append(b)
        else:
            runs.append([b])
    run = max(runs, key=len)
    if len(run) < 3:
        return None
    top, bottom = run[0], run[-1]
    x0 = min(by_y[y][0] for y in run)
    x1 = max(by_y[y][1] for y in run)
    # 열 경계 = 같은 y에서 조각이 갈라지는 x
    split = None
    for y in run:
        segs = sorted([(lo, hi) for yy, lo, hi in rules if yy == y])
        if len(segs) > 1:
            split = round(segs[0][1], 1)
            break
    bands = list(zip(run, run[1:]))
    return {"bbox": (x0, top, x1, bottom), "bands": bands, "split": split}


def main() -> None:
    if not SRC.exists():
        sys.exit(f"원본이 없습니다: {SRC}")
    content = json.loads(CONTENT.read_text(encoding="utf-8"))
    labels = {norm(k): v for k, v in content["labels"].items()}
    sections = content.get("sections", {})
    fontfile = pick_font()
    font = pymupdf.Font(fontfile=fontfile)
    bold_fontfile = ensure_bold_font(fontfile)
    font_bold = pymupdf.Font(fontfile=bold_fontfile) if bold_fontfile != fontfile else font

    doc = pymupdf.open(SRC)
    report: dict = {"font": fontfile, "bold_font": bold_fontfile, "pages": [], "adjustments": [], "untranslated": []}

    for pno, page in enumerate(doc, start=1):
        lines = sorted(
            line_list(page), key=lambda l: (0 if l["bbox"][0] < COLUMN_SPLIT else 1, round(l["bbox"][1], 1), l["bbox"][0])
        )
        if pno == 2:
            # p2 능력치 라벨 줄(EDGE/IRON/HEART/SHADOW/WITS)은 원본에 잘못된 순서의
            # 보이지 않는 사본이 겹쳐 있다(편집 흔적). 실제로 렌더되는 아래쪽 줄만 남긴다.
            dup_words = {"EDGE", "IRON", "HEART", "SHADOW", "WITS"}
            lines = [l for l in lines if not (norm(l["text"]) in dup_words and l["bbox"][1] < 116)]
        lines = merge_wrapped_labels(lines, labels)
        cb_pairs = checkbox_pairs(page)
        jobs: list[dict] = []  # {bbox, text, size, kind, ref}

        # 1) 라벨 치환(모든 쪽 공통): 정규화 문장이 대응표에 있으면 교체
        for ln in lines:
            has_checkbox = any(0xE000 <= ord(ch) <= 0xF8FF for ch in ln["text"])
            if has_checkbox:
                y0, y1 = ln["bbox"][1], ln["bbox"][3]
                for pair in cb_pairs:
                    if not (y0 - 1.5 <= pair["box_bbox"].y0 <= y1 + 1.5):
                        continue
                    ko = labels.get(norm(pair["word"]))
                    if not ko or pair["word_bbox"] is None:
                        continue
                    jobs.append({"bbox": pair["box_bbox"], "kind": "circle", "ref": f"checkbox@{round(pair['box_bbox'].x0)}"})
                    wb = pair["word_bbox"]
                    wsize = pair["size"]
                    right = min(wb.x1 + 60, 612.0 - 20)
                    for other in cb_pairs:
                        if other is pair:
                            continue
                        if abs(other["box_bbox"].y0 - pair["box_bbox"].y0) <= 1.5 and other["box_bbox"].x0 > wb.x0:
                            right = min(right, other["box_bbox"].x0 - 2)
                    rect = pymupdf.Rect(wb.x0 - 1, wb.y0 - 0.32 * wsize, right, wb.y1 + 0.45 * wsize)
                    jobs.append(
                        {
                            "bbox": rect,
                            "text": ko,
                            "size": wsize,
                            "kind": "label",
                            "align": 0,
                            "ref": norm(pair["word"]),
                            **style_of(ln),
                        }
                    )
                continue
            ko = labels.get(norm(ln["text"])) or translate_line(ln["text"], labels)
            if ko:
                # 3~7쪽 액션 제목은 아래 섹션 경로에서 넓은 상자로 다시 앉힌다(중복 방지)
                if 3 <= pno <= 7 and norm(ln["text"]) in sections:
                    continue
                if is_rotated(ln):
                    rect, align = rotated_label_box(ln, page), 1
                    rotate = 270
                else:
                    rect, align = label_box(ln, page)
                    rotate = 0
                jobs.append(
                    {
                        "bbox": rect,
                        "text": ko,
                        "size": ln["size"],
                        "kind": "label",
                        "align": align,
                        "rotate": rotate,
                        "ref": norm(ln["text"]),
                        **style_of(ln),
                    }
                )

        # 2) 3~7쪽 액션 섹션: 제목 + 본문 블록, 표는 셀 단위
        if 3 <= pno <= 7:
            heads = [i for i, l in enumerate(lines) if font_class(l["font"]) == "display" and abs(l["size"] - 12.0) < 0.2]
            for hi, i in enumerate(heads):
                title = norm(lines[i]["text"])
                spec = sections.get(title)
                if not spec:
                    continue
                col = 0 if lines[i]["bbox"][0] < COLUMN_SPLIT else 1
                body = []
                for l in lines[i + 1 :]:
                    lcol = 0 if l["bbox"][0] < COLUMN_SPLIT else 1
                    if lcol != col:
                        continue
                    if font_class(l["font"]) == "display" and abs(l["size"] - 12.0) < 0.2:
                        break
                    body.append(l)
                if not body:
                    continue
                sec_x0 = min(l["bbox"][0] for l in body)
                sec_x1 = max(l["bbox"][2] for l in body)
                sec_y0 = min(l["bbox"][1] for l in body)
                sec_y1 = max(l["bbox"][3] for l in body)
                grid = table_grid(page, sec_x0, sec_x1, min(sec_y0, lines[i]["bbox"][3]), sec_y1 + 2) if spec.get("table") else None

                # 제목(라벨과 같은 상자 규칙을 쓴다)
                trect, talign = label_box(lines[i], wide=True)
                jobs.append(
                    {
                        "bbox": trect,
                        "text": spec["title"],
                        "size": lines[i]["size"],
                        "kind": "title",
                        "align": talign,
                        "ref": title,
                        **style_of(lines[i]),
                    }
                )

                if grid:
                    gx0, gtop, gx1, gbottom = grid["bbox"]
                    bands = grid["bands"]
                    split = grid["split"] or (gx0 + (gx1 - gx0) / 2)
                    rows = spec["table"]
                    # 머리행은 첫 규칙선 바로 위에서 두 열 시작점에 나란히 놓인 줄이다.
                    hdr: list[dict] = []
                    for l in body:
                        if abs(l["bbox"][0] - gx0) > 6 or not (gtop - 26 <= l["bbox"][3] <= gtop + 3):
                            continue
                        for m in body:
                            if abs(m["bbox"][1] - l["bbox"][1]) <= 1.5 and abs(m["bbox"][0] - split) <= 6:
                                hdr.extend([l, m])
                                break
                    header_top = min((l["bbox"][1] for l in hdr), default=gtop)
                    if len(bands) + 1 == len(rows):
                        allbands = [(header_top - 1.5, gtop)] + bands
                    elif len(bands) == len(rows):
                        allbands = bands
                        header_top = gtop
                    else:
                        allbands = None
                    if allbands is None:
                        report["adjustments"].append(
                            f"p{pno} {title}: 표 행 수 불일치 — 격자 {len(bands)}+1 vs 대역 {len(rows)} (셀 치환 생략)"
                        )
                        grid = None
                    else:
                        for band, row in zip(allbands, rows):
                            y0b, y1b = band
                            for x0c, x1c, cell in ((gx0, split, row[0]), (split, gx1, row[1] if len(row) > 1 else "")):
                                if not cell:
                                    continue
                                jobs.append(
                                    {
                                        "bbox": pymupdf.Rect(x0c + CELL_PAD, y0b + CELL_PAD, x1c - CELL_PAD, y1b - CELL_PAD),
                                        "text": cell,
                                        "size": 9.0,
                                        "kind": "cell",
                                        "leading": 1.15,
                                        "ref": f"{title}#{cell[:10]}",
                                        "weight": "regular",
                                        "color": (0, 0, 0),
                                    }
                                )
                    # 표 바깥 본문: 위/아래 구역
                    above = [l for l in body if l["bbox"][3] <= header_top + 2 and l not in hdr]
                    below = [l for l in body if l["bbox"][1] >= gbottom - 2]
                    regions = []
                    if above:
                        r = pymupdf.Rect(
                            min(l["bbox"][0] for l in above),
                            min(l["bbox"][1] for l in above),
                            sec_x1,
                            header_top - 1,
                        )
                        regions.append(("pre", r))
                    if below:
                        r = pymupdf.Rect(
                            min(l["bbox"][0] for l in below),
                            gbottom + 1,
                            sec_x1,
                            max(l["bbox"][3] for l in below) + 1,
                        )
                        regions.append(("post", r))
                else:
                    r = pymupdf.Rect(sec_x0, sec_y0, sec_x1, sec_y1 + 1)
                    regions = [("pre", r)] if spec.get("pre") else []

                for key, rect in regions:
                    text = spec.get(key, "")
                    if text.strip():
                        jobs.append(
                            {
                                "bbox": rect,
                                "text": text,
                                "size": 9.0,
                                "kind": key,
                                "ref": f"{title}:{key}",
                                "weight": "regular",
                                "color": (0, 0, 0),
                            }
                        )

        # 3) 쪽 전체에서 대응이 없는 텍스트 줄 찾기(사람이 볼 목록)
        covered = [j["bbox"] for j in jobs]
        for ln in lines:
            r = pymupdf.Rect(ln["bbox"])
            if any(r.intersects(c) for c in covered):
                continue
            t = norm(ln["text"])
            if not t or t.isdigit() or all(c in "+-0123456789 ." for c in t):
                continue
            if font_class(ln["font"]) == "other":  # 장식 글리프(불릿 기호 등)
                continue
            report["untranslated"].append(f"p{pno} y{round(ln['bbox'][1])}: {ln['text'][:70]}")

        # 4) 텍스트만 삭제(그래픽 보존) 후 삽입
        for j in jobs:
            page.add_redact_annot(j["bbox"])
        page.apply_redactions(
            images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE
        )

        page_stats = {"page": pno, "jobs": len(jobs), "shrunk": 0}
        for j in jobs:
            rect = j["bbox"]
            if j["kind"] == "circle":
                cx, cy = (rect.x0 + rect.x1) / 2, (rect.y0 + rect.y1) / 2 + 0.9
                radius = min(rect.width, rect.height) * 0.32
                page.draw_circle((cx, cy), radius, color=(0.25, 0.25, 0.26), width=1.15)
                continue
            if rect.width < 2 or rect.height < 2:
                report["adjustments"].append(f"p{pno} {j['ref']}: 상자가 너무 작아 건너뜀")
                continue
            size = j["size"]
            scale_floor = MIN_SCALE
            lead = j.get("leading", LEADING)
            weight = j.get("weight", "regular")
            use_font = font_bold if weight == "bold" else font
            use_fontfile = bold_fontfile if weight == "bold" else fontfile
            use_fontname = "kokr-bold" if weight == "bold" else "kokr"
            color = j.get("color", (0, 0, 0))
            rotate = j.get("rotate", 0)
            wrap_w, wrap_h = (rect.height, rect.width) if rotate in (90, 270) else (rect.width, rect.height)
            while needed_height(j["text"], use_font, size, wrap_w, lead) > wrap_h:
                size = round(size - 0.1, 2)
                if size < j["size"] * scale_floor:
                    size = round(j["size"] * scale_floor, 2)
                    break
            rc = page.insert_textbox(
                rect, j["text"], fontname=use_fontname, fontfile=use_fontfile, fontsize=size, rotate=rotate,
                align=j.get("align", 0), lineheight=lead, color=color,
            )
            while rc < 0 and size > j["size"] * 0.75:
                size = round(size - 0.2, 2)
                rc = page.insert_textbox(
                    rect, j["text"], fontname=use_fontname, fontfile=use_fontfile, fontsize=size, rotate=rotate,
                    align=j.get("align", 0), lineheight=lead, color=color,
                )
            if rc < 0:
                report["adjustments"].append(f"p{pno} {j['ref']}: 최소 크기에서도 넘침 — 사람이 조판해야 함")
            elif size < j["size"] - 0.05:
                page_stats["shrunk"] += 1
                report["adjustments"].append(f"p{pno} {j['ref']}: {j['size']}pt → {size}pt ({(size / j['size'] - 1) * 100:+.1f}%)")
        report["pages"].append(page_stats)

    # 5) 라이선스 표기 삽입(원문 고지는 그대로 두고 한국어 안내를 덧붙인다)
    for ins in content.get("inserts", []):
        page = doc[ins["page"] - 1]
        page.insert_textbox(
            pymupdf.Rect(ins["bbox"]),
            ins["text"],
            fontname="kokr",
            fontfile=fontfile,
            fontsize=ins.get("size", 7.0),
            align=0,
            lineheight=1.25,
        )

    doc.subset_fonts()
    doc.save(OUT, garbage=3, deflate=True)
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"완성: {OUT.name}  (쪽 {doc.page_count}, 치환 {sum(p['jobs'] for p in report['pages'])}블록)")
    for p in report["pages"]:
        print(f"  p{p['page']:>2}: {p['jobs']:>3}블록 (축소 {p['shrunk']}개)")
    if report["adjustments"]:
        print("\n[조정 내역]")
        for a in report["adjustments"][:40]:
            print("  -", a)
    if report["untranslated"]:
        print(f"\n[미번역 {len(report['untranslated'])}줄] (앞 25줄)")
        for u in report["untranslated"][:25]:
            print("  -", u)


if __name__ == "__main__":
    main()
