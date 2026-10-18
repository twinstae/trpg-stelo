import { readFileSync, existsSync } from 'node:fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

const dir = 'src/data/ptolus';
const parser = unified().use(remarkParse).use(remarkGfm);

function sections(path) {
  const root = parser.parse(readFileSync(path, 'utf8'));
  const out = [];
  let cur = { heading: '(preamble)', depth: 0, blocks: [] };
  for (const node of root.children) {
    if (node.type === 'heading' && node.depth >= 2) {
      if (cur.blocks.length || cur.heading !== '(preamble)') out.push(cur);
      cur = { heading: node.children.map((c) => c.value ?? '').join(''), depth: node.depth, blocks: [] };
    } else {
      cur.blocks.push(node.type);
    }
  }
  out.push(cur);
  return out;
}

let ok = true;
for (const file of readFileSync('src/data/ptolus/chapters.ts', 'utf8').matchAll(/slug: "([^"]+)"/g)) {
  const slug = file[1];
  const enPath = `${dir}/en/${slug}.md`;
  const koPath = `${dir}/ko/${slug}.md`;
  if (!existsSync(enPath)) {
    console.log(`MISSING en ${slug}`);
    ok = false;
    continue;
  }
  const en = sections(enPath);
  if (!existsSync(koPath)) {
    console.log(`(pending) ${slug}: en ${en.length} sections`);
    continue;
  }
  const ko = sections(koPath);
  let pairOk = en.length === ko.length;
  const problems = [];
  for (let i = 0; i < Math.min(en.length, ko.length); i++) {
    const a = en[i];
    const b = ko[i];
    const same = a.depth === b.depth && a.blocks.length === b.blocks.length && a.blocks.every((t, j) => t === b.blocks[j]);
    if (!same) {
      pairOk = false;
      problems.push(`  #${i} en="${a.heading}" h${a.depth} [${a.blocks}] / ko="${b.heading}" h${b.depth} [${b.blocks}]`);
    }
  }
  if (!pairOk) {
    ok = false;
    console.log(`MISMATCH ${slug}: en ${en.length} / ko ${ko.length}`);
    console.log(problems.join('\n'));
  } else {
    console.log(`ok ${slug} (${en.length} sections)`);
  }
}
console.log(ok ? 'ALL OK' : 'FAILED');
process.exit(ok ? 0 : 1);
