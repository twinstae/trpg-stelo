#!/usr/bin/env python3
"""플레이킷 한국어 콘텐츠 시드.

매니페스트(.freebuff/playkit/manifest.json)를 보고 content.json을 만든다.

* p3~7 액션: 기존 대역(src/data/ironsworn/ko/*.md)의 인용 블록을 그대로 가져와
  pre(표 앞 본문) / table(표 행) / post(표 뒤 본문)로 쪼갠다.
* 표지·시트·워크시트 라벨은 용어집(GLOSSARY.md) 기준 손 대응표(LABELS)에서 가져온다.

실행:
    python3 scripts/playkit-ko/seed_content.py
결과: scripts/playkit-ko/content.json  (사람이 직접 고쳐도 된다)

원문 Ironsworn Playkit © Shawn Tomkin, CC BY-NC-SA 4.0. 이 번역도 같은 조건.
"""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
MANIFEST = ROOT / ".freebuff" / "playkit" / "manifest.json"
CONTENT = pathlib.Path(__file__).resolve().parent / "content.json"
KO = ROOT / "src" / "data" / "ironsworn" / "ko"

# 플레이킷 액션 제목 → (대역 파일, 대역 제목)
SECTION_SOURCES: dict[str, tuple[str, str]] = {
    "FACE DANGER": ("adventure-moves", "위험 맞서기"),
    "SECURE AN ADVANTAGE": ("adventure-moves", "우위 잡기"),
    "GATHER INFORMATION": ("adventure-moves", "정보 모으기"),
    "HEAL": ("adventure-moves", "치유하기"),
    "RESUPPLY": ("adventure-moves", "보급하기"),
    "MAKE CAMP": ("adventure-moves", "야영하기"),
    "UNDERTAKE A JOURNEY": ("adventure-moves", "여정 떠나기"),
    "REACH YOUR DESTINATION": ("adventure-moves", "목적지에 닿기"),
    "COMPEL": ("relationship-moves", "강요하기"),
    "SOJOURN": ("relationship-moves", "머물기"),
    "DRAW THE CIRCLE": ("relationship-moves", "결투 걸기"),
    "FORGE A BOND": ("relationship-moves", "유대 맺기"),
    "TEST YOUR BOND": ("relationship-moves", "유대 시험하기"),
    "AID YOUR ALLY": ("relationship-moves", "동료 돕기"),
    "WRITE YOUR EPILOGUE": ("relationship-moves", "종막 쓰기"),
    "ENTER THE FRAY": ("combat-moves", "싸움에 들기"),
    "STRIKE": ("combat-moves", "공격하기"),
    "CLASH": ("combat-moves", "맞붙기"),
    "TURN THE TIDE": ("combat-moves", "판 뒤집기"),
    "END THE FIGHT": ("combat-moves", "싸움 끝내기"),
    "BATTLE": ("combat-moves", "전투"),
    "OTHER MOVES TO MAKE IN COMBAT": ("combat-moves", "싸움 중의 다른 액션"),
    "ENDURE HARM": ("suffer-moves", "피해 견디기"),
    "ENDURE STRESS": ("suffer-moves", "스트레스 견디기"),
    "COMPANION ENDURE HARM": ("suffer-moves", "동반자가 피해 견디기"),
    "FACE DEATH": ("suffer-moves", "죽음 맞서기"),
    "FACE DESOLATION": ("suffer-moves", "황폐함 맞서기"),
    "OUT OF SUPPLY": ("suffer-moves", "보급 바닥나기"),
    "FACE A SETBACK": ("suffer-moves", "낙담하기"),
    "SWEAR AN IRON VOW": ("quest-moves", "철의 맹세를 하기"),
    "REACH A MILESTONE": ("quest-moves", "이정표에 닿기"),
    "FULFILL YOUR VOW": ("quest-moves", "맹세 이행하기"),
    "FORSAKE YOUR VOW": ("quest-moves", "맹세 저버리기"),
    "ADVANCE": ("quest-moves", "성장하기"),
    "PAY THE PRICE": ("fate-moves", "값을 치르기"),
    "ASK THE ORACLE": ("fate-moves", "오라클에게 묻기"),
}

LABELS: dict[str, str] = {
    # 표지 (p1)
    "IRONSWORN": "철의 맹세",
    "PLAYKIT": "플레이킷",
    "This file includes print-and-play materials for the": "이 파일은 철의 맹세 테이블탑 롤플레잉 게임의",
    "Ironsworn tabletop roleplaying game.": "인쇄용 자료를 담고 있습니다.",
    "CHARACTER SHEET": "캐릭터 시트",
    "Track your character’s status, condition, and experience.": "캐릭터의 상태와 결점, 경험을 기록합니다.",
    "MOVES REFERENCE": "액션 레퍼런스",
    "Printable reference sheets for Ironsworn moves.": "철의 맹세 액션 참조 시트입니다.",
    "Keep this handy while you play.": "플레이할 때 곁에 두십시오.",
    "PROGRESS TRACKS WORKSHEET": "진행 트랙 워크시트",
    "Track your progress for vows, journeys, and fights.": "맹세와 여정, 싸움의 진척을 기록합니다.",
    "ORACLES WORKSHEET": "오라클 워크시트",
    "Create your own oracle tables.": "직접 오라클 표를 만듭니다.",
    "IRONLANDS MAP": "철의 땅 지도",
    "Printable grayscale map of the Ironlands": "인쇄용 철의 땅 흑백 지도",
    # 쪽 제목 (p3~7)
    "ADVENTURE MOVES": "모험 액션",
    "RELATIONSHIP MOVES": "관계 액션",
    "COMBAT MOVES": "전투 액션",
    "SUFFER MOVES": "피해 액션",
    "QUEST MOVES": "임무 액션",
    "FATE MOVES": "운명 액션",
    # 액션 이름 (제목 겸용)
    "FACE DANGER": "위험 맞서기",
    "SECURE AN ADVANTAGE": "우위 잡기",
    "GATHER INFORMATION": "정보 모으기",
    "HEAL": "치유하기",
    "RESUPPLY": "보급하기",
    "MAKE CAMP": "야영하기",
    "UNDERTAKE A JOURNEY": "여정 떠나기",
    "REACH YOUR DESTINATION": "목적지에 닿기",
    "COMPEL": "강요하기",
    "SOJOURN": "머물기",
    "DRAW THE CIRCLE": "결투 걸기",
    "FORGE A BOND": "유대 맺기",
    "TEST YOUR BOND": "유대 시험하기",
    "AID YOUR ALLY": "동료 돕기",
    "WRITE YOUR EPILOGUE": "종막 쓰기",
    "ENTER THE FRAY": "싸움에 들기",
    "STRIKE": "공격하기",
    "CLASH": "맞붙기",
    "TURN THE TIDE": "판 뒤집기",
    "END THE FIGHT": "싸움 끝내기",
    "BATTLE": "전투",
    "OTHER MOVES TO MAKE IN COMBAT": "싸움 중의 다른 액션",
    "ENDURE HARM": "피해 견디기",
    "ENDURE STRESS": "스트레스 견디기",
    "COMPANION ENDURE HARM": "동반자가 피해 견디기",
    "FACE DEATH": "죽음 맞서기",
    "FACE DESOLATION": "황폐함 맞서기",
    "OUT OF SUPPLY": "보급 바닥나기",
    "FACE A SETBACK": "낙담하기",
    "SWEAR AN IRON VOW": "철의 맹세를 하기",
    "REACH A MILESTONE": "이정표에 닿기",
    "FULFILL YOUR VOW": "맹세 이행하기",
    "FORSAKE YOUR VOW": "맹세 저버리기",
    "ADVANCE": "성장하기",
    "PAY THE PRICE": "값을 치르기",
    "ASK THE ORACLE": "오라클에게 묻기",
    # 캐릭터 시트 (p2)
    "CHARACTER": "캐릭터",
    "EXPERIENCE": "경험",
    "EDGE": "기민",
    "HEART": "심지",
    "IRON": "강철",
    "SHADOW": "그림자",
    "WITS": "지혜",
    "HEALTH": "건강",
    "SPIRIT": "정신",
    "SUPPLY": "보급",
    "MOMENTUM": "모멘텀",
    "MAX": "최대",
    "RESET": "초기화",
    "STATUS": "상태",
    "BONDS": "유대",
    "VOWS": "맹세",
    "DEBILITIES": "결점",
    "CONDITIONS": "조건",
    "BANES": "재앙",
    "BURDENS": "부담",
    "WOUNDED": "부상",
    "SHAKEN": "동요",
    "UNPREPARED": "준비 부족",
    "ENCUMBERED": "과적",
    "MAIMED": "불구",
    "CORRUPTED": "부패",
    "CURSED": "저주",
    "TORMENTED": "고뇌",
    "TROUBLESOME": "성가신",
    "DANGEROUS": "위험한",
    "FORMIDABLE": "막강한",
    "EXTREME": "극한",
    "EPIC": "서사",
    # 워크시트 (p8, p9)
    "PROGRESS TRACK WORKSHEET": "진행 트랙 워크시트",
    "ORACLES WORKSHEET": "오라클 워크시트",
    "ORACLE:": "오라클:",
    "ROLL": "굴림",
    "RESULT": "결과",
    "EQUALLY LIKELY": "반반",
    "LESS LIKELY": "불리함",
    "MORE LIKELY": "유력함",
    "Dangerous:": "위험한:",
    "Troublesome:": "성가신:",
    "Formidable:": "막강한:",
    "Extreme:": "극한:",
    "Epic:": "서사:",
    "mark 3 progress": "진척 3 표시",
    "mark 2 progress": "진척 2 표시",
    "mark 1 progress": "진척 1 표시",
    "mark 2 ticks": "틱 2 표시",
    "mark 1 tick": "틱 1 표시",
    # 뒤표지 (p10)
    "THE IRONLANDS": "철의 땅",
}

# 표지 저작권 고지 아래에 덧붙일 한국어 안내(원문 고지는 그대로 둔다)
INSERTS = [
    {
        "page": 1,
        "bbox": [119.5, 680.0, 495.2, 704.0],
        "size": 7.0,
        "text": "이 문서는 위 원문(Ironsworn Playkit © Shawn Tomkin)의 비영리 한국어 팬 번역이며, "
        "원문과 같은 CC BY-NC-SA 4.0 조건으로 배포됩니다.",
    }
]

# 대역 인용 블록이 없는 섹션은 여기서 직접 적는다.
MANUAL_SECTIONS: dict[str, dict] = {
    "OTHER MOVES TO MAKE IN COMBAT": {
        "title": "싸움 중의 다른 액션",
        "pre": "\n".join(
            [
                "우위 잡기: 적을 앞지르거나 속임수로 제압할 때, 또는 다른 액션을 준비할 때.",
                "위험 맞서기: 장애물을 넘거나, 위험을 피하거나, 도망치거나, 반격하지 않고 공격을 흘려낼 때.",
                "동료 돕기: 동료에게 유리하도록 액션을 할 때.",
                "강요하기: 항복을 받아내거나, 적이 물러서도록 압박하거나, 휴전을 협상할 때.",
            ]
        ),
        "table": [],
        "post": "",
    }
}

BULLET = "\u2022"
TABLE_ROW = re.compile(r"^\|(.+)\|$")
TABLE_SEP = re.compile(r"^\|[\s:|-]+\|$")


def norm(s: str) -> str:
    return " ".join(s.replace("\u2019", "’").split())


def ko_blockquote(path: pathlib.Path, heading: str) -> list[str]:
    """대역 파일에서 특정 제목 아래 인용 블록의 줄들을 뽑는다(표 행 포함)."""
    text = path.read_text(encoding="utf-8")
    m = re.search(rf"^### {re.escape(heading)}\s*$", text, re.M)
    if not m:
        raise SystemExit(f"대역 제목을 찾지 못함: {heading} ({path.name})")
    rest = text[m.end() :]
    nxt = re.search(r"^#{2,3} ", rest, re.M)
    section = rest[: nxt.start()] if nxt else rest

    out: list[str] = []
    for line in section.splitlines():
        if line.startswith(">"):
            body = line.lstrip(">").strip()
            if not body:
                continue
            body = re.sub(r"\*\*(.+?)\*\*", r"\1", body)
            body = re.sub(r"`(.+?)`", r"\1", body)
            out.append(BULLET + " " + body[2:].strip() if body.startswith("- ") else body)
        elif line.startswith("|"):
            out.append(line.strip())
        elif line.strip() == "":
            continue
        else:
            break  # 인용 블록 끝
    return out


def split_section(lines: list[str]) -> dict:
    """인용 블록 줄들을 pre / table / post로 나눈다."""
    pre: list[str] = []
    table: list[list[str]] = []
    post: list[str] = []
    for ln in lines:
        if ln.startswith("|"):
            if TABLE_SEP.match(ln):
                continue
            cells = [c.strip() for c in TABLE_ROW.match(ln).group(1).split("|")]
            cells = [re.sub(r"^\*\*(.+?)\*\*$", r"\1", c) for c in cells]
            table.append(cells)
        elif table:
            post.append(ln)
        else:
            pre.append(ln)
    return {"pre": "\n".join(pre).strip(), "table": table, "post": "\n".join(post).strip()}


def manifest_sections() -> dict[str, int]:
    """플레이킷 3~7쪽에 실제로 있는 액션 제목 → (쪽, 본문 줄 수)."""
    m = json.loads(MANIFEST.read_text(encoding="utf-8"))
    found: dict[str, int] = {}
    for pg in m["pages"]:
        if pg["page"] < 3 or pg["page"] > 7:
            continue
        ps = sorted(pg["paragraphs"], key=lambda p: (p["column"], p["bbox"][1]))
        for i, p in enumerate(ps):
            if p["font_class"] != "display" or abs(p["size"] - 12.0) > 0.2:
                continue
            title = norm(p["text"])
            col = p["column"]
            n = 0
            for q in ps[i + 1 :]:
                if q["column"] != col:
                    continue
                if q["font_class"] == "display" and abs(q["size"] - 12.0) < 0.2:
                    break
                n += 1
            found[title] = n
    return found


def main() -> None:
    found = manifest_sections()
    sections: dict[str, dict] = {}
    problems: list[str] = []

    for title, lines in [(t, n) for t, n in found.items()]:
        if title in MANUAL_SECTIONS:
            sections[title] = dict(MANUAL_SECTIONS[title])
            continue
        src = SECTION_SOURCES.get(title)
        if not src:
            problems.append(f"{title}: 대역 대응표에 없음 — 새로 번역해야 함")
            continue
        fname, kohead = src
        raw = ko_blockquote(KO / f"{fname}.md", kohead)
        spec = split_section(raw)
        spec["title"] = LABELS.get(title, title)
        sections[title] = spec
        if not spec["pre"] and not spec["table"]:
            problems.append(f"{title}: 대역 인용 블록이 비어 있음 ({fname} / {kohead})")
        if spec["table"] and not found.get(title):
            problems.append(f"{title}: 표만 있고 본문 없음")

    for t, n in found.items():
        if t not in sections:
            continue
        # 본문 줄 수와 대역 분량이 크게 어긋나면 사람이 볼 목록에 올린다
        ko_lines = [l for l in sections[t]["pre"].splitlines() if l.strip()]
        if n and len(ko_lines) < n * 0.4:
            problems.append(f"{t}: 원문 문단 {n}개 vs 대역 {len(ko_lines)}줄 — 일부 누락 의심")

    out = {
        "_readme": "플레이킷 한국어 대응표. labels=영어 문자열→한국어, sections=액션별 조판 내용.",
        "_license": "원문 Ironsworn Playkit © Shawn Tomkin, CC BY-NC-SA 4.0. 이 번역도 같은 조건.",
        "labels": LABELS,
        "sections": sections,
        "inserts": INSERTS,
    }
    CONTENT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    tables = sum(1 for s in sections.values() if s["table"])
    print(f"content.json 작성: 섹션 {len(sections)}개(표 {tables}개), 라벨 {len(LABELS)}개")
    print(f"플레이킷 3~7쪽 액션 제목 {len(found)}개 중 {len(sections)}개 확정")
    if problems:
        print("\n[손봐야 할 자리]")
        for p in problems:
            print("  -", p)


if __name__ == "__main__":
    main()
