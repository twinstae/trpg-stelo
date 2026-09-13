// 던전월드 2 번역본의 내부 링크·앵커 검사 도구
//
//   bun scripts/dw2-check-links.mjs
//
// 검사 항목:
//  1. `/ko/awe/dw2/<파일>#<앵커>` 링크의 대상 파일과 앵커가 실제로 있는가
//  2. 같은 파일 안 `](#앵커)` 링크의 앵커가 그 파일에 있는가
//  3. 원문 앵커 맵(scripts/dw2-beta-linkmap.json)의 앵커가 모두 살아 있는가
//  4. 앵커 중복이 없는가

import { readFileSync, readdirSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const DIRS = [ROOT + "src/data/dw2/en/", ROOT + "src/data/dw2/ko/"];

const byName = new Map();
for (const dir of DIRS) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    byName.set(f.replace(/\.md$/, ""), readFileSync(dir + f, "utf8"));
  }
}

const ANCHOR_DEF_RE = /<a id="([^"]+)"><\/a>/g;
const anchors = new Map(); // file -> Set(anchor)
const dupes = [];
for (const [name, text] of byName) {
  const set = new Set();
  for (const m of text.matchAll(ANCHOR_DEF_RE)) {
    const id = m[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"');
    if (set.has(id)) dupes.push(`${name}: #${id}`);
    set.add(id);
  }
  anchors.set(name, set);
}

const errors = [];
let crossLinks = 0;
let sameLinks = 0;

// 마크다운 `](...)` 목적지 추출 (이스케이프된 괄호 처리)
function* linkTargets(text) {
  let i = 0;
  for (;;) {
    const idx = text.indexOf("](", i);
    if (idx === -1) return;
    let j = idx + 2;
    while (j < text.length) {
      const c = text[j];
      if (c === "\\") { j += 2; continue; }
      if (c === ")") break;
      j++;
    }
    yield text.slice(idx + 2, j);
    i = j + 1;
  }
}

for (const [name, text] of byName) {
  for (const raw of linkTargets(text)) {
    const target = raw.replace(/\\(.)/g, "$1");
    if (target.startsWith("/ko/awe/dw2/")) {
      const rest = target.slice("/ko/awe/dw2/".length);
      const hash = rest.indexOf("#");
      const path = hash === -1 ? rest : rest.slice(0, hash);
      const anchor = hash === -1 ? "" : rest.slice(hash + 1);
      crossLinks++;
      if (!byName.has(path)) errors.push(`${name}: 없는 파일 → ${target}`);
      else if (anchor && !anchors.get(path).has(anchor)) errors.push(`${name}: 없는 앵커 → ${target}`);
    } else if (target.startsWith("#")) {
      sameLinks++;
      const anchor = target.slice(1);
      if (!anchors.get(name).has(anchor)) errors.push(`${name}: 같은 파일에 없는 앵커 → ${target}`);
    }
  }
}

// 원문 앵커 보존 확인
let missingFromSource = 0;
try {
  const map = JSON.parse(readFileSync(ROOT + "scripts/dw2-beta-linkmap.json", "utf8"));
  for (const [id, file] of Object.entries(map.anchors)) {
    if (!anchors.get(file)?.has(id)) {
      missingFromSource++;
      errors.push(`원문 앵커 소실: #${id} (${file})`);
    }
  }
  console.log(`원문 앵커 맵: ${map.anchorCount}개 중 ${map.anchorCount - missingFromSource}개 보존`);
} catch {
  console.log("원문 앵커 맵 없음 — 3번 항목은 건너뜀");
}

console.log(`검사한 링크: 파일 간 ${crossLinks}개, 같은 파일 ${sameLinks}개`);
console.log(`앵커: ${[...anchors.values()].reduce((n, s) => n + s.size, 0)}개`);
if (dupes.length) console.log(`\n⚠ 앵커 중복 ${dupes.length}건:\n  ` + dupes.join("\n  "));
if (errors.length) {
  console.log(`\n❌ 문제 ${errors.length}건:`);
  for (const e of errors.slice(0, 40)) console.log("  " + e);
  if (errors.length > 40) console.log(`  … 외 ${errors.length - 40}건`);
  process.exitCode = 1;
} else {
  console.log("\n✅ 모든 내부 링크·앵커 정상");
}
