#!/usr/bin/env python3
"""D&D 2024 SRD 대역: 영어·한국어 원고의 줄마다 굵게(**) 개수를 비교한다.

  python3 -I scripts/dnd-2024-boldcheck.py <슬러그> [<슬러그> ...]

원문에 없는 굵게를 덧붙였거나 빠뜨린 줄을 알려 준다. 원문 문단 안의 잘못된 줄바꿈 때문에
"line count differs"가 나오면 그 뒤 줄은 한 칸씩 밀려 보일 수 있다.
"""
import sys,re
for slug in sys.argv[1:]:
    en=[l for l in open(f'src/data/dnd-2024/en/{slug}.md').read().split('\n') if l.strip()]
    ko=[l for l in open(f'src/data/dnd-2024/ko/{slug}.md').read().split('\n') if l.strip()]
    if len(en)!=len(ko): print(f'{slug}: line count differs en={len(en)} ko={len(ko)}')
    for i,(e,k) in enumerate(zip(en,ko)):
        if e.count('**')!=k.count('**'):
            print(f'{slug}:{i}: bold en={e.count("**")//2} ko={k.count("**")//2} | {k[:110]}')
