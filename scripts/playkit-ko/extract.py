#!/usr/bin/env python3
"""Ironsworn 플레이킷(PDF) 문단 매니페스트 추출기.

원본 PDF의 텍스트를 '문단' 단위로 묶어 좌표·폰트·크기와 함께 JSON으로 떨군다.
apply.py가 이 매니페스트 + content.json(한국어) 로 인플레이스 치환을 수행한다.

실행:
    uv run --no-project --with pymupdf python scripts/playkit-ko/extract.py

원문: Ironsworn Playkit © Shawn Tomkin, CC BY-NC-SA 4.0 (비영리 팬 번역).
"""
from __future__ import annotations

import json
import pathlib
import sys

import pymupdf

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "Ironsworn-Playkit.pdf"
OUT = ROOT / ".freebuff" / "playkit" / "manifest.json"

# 열 구분 기준선(레터 612pt 기준 가운데). p1/p2/p8/p9/p10은 폭 전체를 쓴다.
COLUMN_SPLIT = 300.0


def line_list(page: pymupdf.Page) -> list[dict]:
    """페이지의 모든 텍스트 줄을 좌표·폰트 정보와 함께 뽑는다."""
    out: list[dict] = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            spans = [s for s in line["spans"] if s["text"].strip()]
            if not spans:
                continue
            out.append(
                {
                    "bbox": list(line["bbox"]),
                    "size": round(max(s["size"] for s in spans), 2),
                    "font": spans[0]["font"],
                    "color": pymupdf.sRGB_to_pdf(spans[0]["color"]),
                    "dir": list(line.get("dir", (1.0, 0.0))),
                    "text": "".join(s["text"] for s in spans).rstrip(),
                }
            )
    return out


def font_class(font: str) -> str:
    """폰트 이름을 역할별로 뭉갠다(제목체/본문체/기타)."""
    if "Modesto" in font:
        return "display"
    if "Minion" in font:
        return "body"
    return "other"


def merge_paragraphs(lines: list[dict], col_of, line_gap: float) -> list[dict]:
    """같은 열·같은 폰트·같은 크기로 이어지는 줄을 한 문단으로 합친다."""
    paras: list[dict] = []
    for ln in lines:
        col = col_of(ln)
        cur = paras[-1] if paras else None
        if (
            cur
            and cur["column"] == col
            and cur["font_class"] == font_class(ln["font"])
            and abs(cur["size"] - ln["size"]) <= 0.25
            # 이어지는 줄이면(행간 이내) 같은 문단으로 본다
            and 0 <= ln["bbox"][1] - cur["bbox"][3] <= line_gap
        ):
            cur["bbox"] = [
                min(cur["bbox"][0], ln["bbox"][0]),
                cur["bbox"][1],
                max(cur["bbox"][2], ln["bbox"][2]),
                ln["bbox"][3],
            ]
            cur["text"] += "\n" + ln["text"]
            cur["lines"] += 1
        else:
            paras.append(
                {
                    "page": None,
                    "column": col,
                    "font": ln["font"],
                    "font_class": font_class(ln["font"]),
                    "size": ln["size"],
                    "bbox": list(ln["bbox"]),
                    "text": ln["text"],
                    "lines": 1,
                }
            )
    return paras


def build() -> dict:
    if not SRC.exists():
        sys.exit(f"원본이 없습니다: {SRC}")

    doc = pymupdf.open(SRC)
    pages = []
    for pno, page in enumerate(doc, start=1):
        lines = sorted(
            line_list(page),
            key=lambda l: (0 if l["bbox"][0] < COLUMN_SPLIT else 1, round(l["bbox"][1], 1), l["bbox"][0]),
        )

        def col_of(ln: dict) -> int:
            return 0 if ln["bbox"][0] < COLUMN_SPLIT else 1

        # 행간 이내로 이어지는 줄을 합치되, 제목체는 한 줄씩 독립시킨다.
        paras: list[dict] = []
        idx = 0
        while idx < len(lines):
            ln = lines[idx]
            if font_class(ln["font"]) == "display":
                paras.append(
                    {
                        "page": pno,
                        "column": col_of(ln),
                        "font": ln["font"],
                        "font_class": "display",
                        "size": ln["size"],
                        "bbox": list(ln["bbox"]),
                        "text": ln["text"],
                        "lines": 1,
                    }
                )
                idx += 1
                continue
            # 본문/기타: 뒤따르는 줄을 문단으로 병합
            run = [ln]
            j = idx + 1
            while j < len(lines):
                nxt = lines[j]
                if font_class(nxt["font"]) == "display":
                    break
                if col_of(nxt) != col_of(run[-1]):
                    break
                if abs(nxt["size"] - run[-1]["size"]) > 0.25:
                    break
                if font_class(nxt["font"]) != font_class(run[-1]["font"]):
                    break
                gap = nxt["bbox"][1] - run[-1]["bbox"][3]
                if not (0 <= gap <= max(1.9 * nxt["size"], 5.0)):
                    break
                run.append(nxt)
                j += 1
            paras.append(
                {
                    "page": pno,
                    "column": col_of(ln),
                    "font": ln["font"],
                    "font_class": font_class(ln["font"]),
                    "size": ln["size"],
                    "bbox": [
                        min(r["bbox"][0] for r in run),
                        min(r["bbox"][1] for r in run),
                        max(r["bbox"][2] for r in run),
                        max(r["bbox"][3] for r in run),
                    ],
                    "text": "\n".join(r["text"] for r in run),
                    "lines": len(run),
                }
            )
            idx = j

        # 각 문단에 id 부여 + 아래쪽 여유(다음 문단까지의 빈 공간) 계산
        for k, p in enumerate(paras):
            p["id"] = f"p{pno:02d}-{k:03d}"
            nxt = paras[k + 1] if k + 1 < len(paras) else None
            same_col_next = nxt if (nxt and nxt["column"] == p["column"]) else None
            p["slack_below"] = (
                round(same_col_next["bbox"][1] - p["bbox"][3], 2) if same_col_next else None
            )
        pages.append({"page": pno, "width": round(page.rect.width, 1), "height": round(page.rect.height, 1), "paragraphs": paras})

    total = sum(len(p["paragraphs"]) for p in pages)
    return {"source": str(SRC), "pages": pages, "paragraph_count": total}


def main() -> None:
    data = build()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"문단 {data['paragraph_count']}개 → {OUT.relative_to(ROOT)}")
    for pg in data["pages"]:
        ps = pg["paragraphs"]
        sizes = sorted({p["size"] for p in ps})
        print(
            f"  p{pg['page']:>2}: 문단 {len(ps):>3}개, 크기 {sizes}, "
            f"제목 {sum(1 for p in ps if p['font_class'] == 'display')}개"
        )


if __name__ == "__main__":
    main()
