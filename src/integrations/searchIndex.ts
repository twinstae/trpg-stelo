/**
 * 빌드가 끝난 뒤 dist의 HTML에서 본문(#article)의 글을 뽑아 분류(/ko/<분류>/)마다
 * FlexSearch 색인을 만들어 dist/search/에 둔다. 마크다운·MDX·데이터로 그리는 대역 페이지가
 * 모두 같은 모양의 HTML로 끝나므로, 원고 대신 결과물을 읽으면 페이지 종류를 가리지 않는다.
 *
 * 개발 서버는 HTML을 미리 만들지 않으므로 마지막 빌드의 dist/search/를 그대로 내준다.
 */
import { readdir, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync, createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { fromHtml } from 'hast-util-from-html';
import type { Element, Nodes, Root } from 'hast';
import { Charset, Document } from 'flexsearch';
import {
	createSearchOptions,
	sectionOf,
	SEARCH_BASE,
	type SearchBlock,
	type SearchManifest,
	type SearchPage,
	type SearchSectionFile,
} from '../search/shared';
import { SIDEBAR } from '../config';

/** 글 흐름 안에 머무는 요소. 나머지 요소는 모두 새 덩어리를 연다. */
const INLINE = new Set([
	'a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'del', 'dfn', 'em', 'i', 'ins', 'kbd',
	'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'label',
]);
/** 본문이 아닌 요소. 목차·스크립트·장식은 색인하지 않는다. */
const SKIP = new Set(['nav', 'script', 'style', 'template', 'noscript', 'svg', 'button', 'aside', 'form', 'select', 'input', 'textarea']);
const HEADING = /^h[1-6]$/;

type Column = 'en' | 'ko' | 'default';
type HeadingState = { text: string; id: string | null } | null;

function classes(node: Element): string[] {
	const value = node.properties['className'];
	return Array.isArray(value) ? value.map(String) : [];
}

function findArticle(node: Nodes): Element | null {
	if (node.type === 'element' && node.properties['id'] === 'article') return node;
	if ('children' in node) {
		for (const child of node.children) {
			const found = findArticle(child);
			if (found) return found;
		}
	}
	return null;
}

function findTitle(node: Nodes): string | null {
	if (node.type === 'element' && node.tagName === 'title') {
		return node.children.map((c) => (c.type === 'text' ? c.value : '')).join('');
	}
	if ('children' in node) {
		for (const child of node.children) {
			const found = findTitle(child);
			if (found !== null) return found;
		}
	}
	return null;
}

const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

/** 본문을 문단·목록 항목·제목 같은 덩어리로 자르고, 덩어리마다 가장 가까운 앞 제목을 단다. */
function extractBlocks(article: Element): Omit<SearchBlock, 'id' | 'p'>[] {
	const blocks: (Omit<SearchBlock, 'id' | 'p'> & { column: Column })[] = [];
	// 대역 페이지는 영어 칸과 한국어 칸이 번갈아 나오므로 칸마다 따로 제목을 따라간다.
	const headings: Record<Column, HeadingState> = { en: null, ko: null, default: null };

	function visit(node: Element, column: Column) {
		const cls = classes(node);
		const nextColumn: Column = cls.includes('en') ? 'en' : cls.includes('ko') ? 'ko' : column;
		const isHeading = HEADING.test(node.tagName);
		let buffer = '';

		const flush = () => {
			const text = squash(buffer);
			buffer = '';
			if (!text) return;
			if (isHeading) {
				// 페이지 제목(h1)은 결과에 페이지 이름으로 이미 나오므로 앵커로만 쓰지 않는다.
				const id = typeof node.properties['id'] === 'string' ? node.properties['id'] : null;
				headings[nextColumn] = node.tagName === 'h1' ? null : { text, id };
			}
			const heading = headings[nextColumn];
			blocks.push({ h: heading?.text ?? null, a: heading?.id ?? null, t: text, column: nextColumn });
		};

		const collect = (child: Element['children'][number]) => {
			if (child.type === 'text') {
				buffer += child.value;
				return;
			}
			if (child.type !== 'element') return;
			if (SKIP.has(child.tagName) || String(child.properties['ariaHidden']) === 'true') return;
			if (child.tagName === 'br') {
				buffer += ' ';
			} else if (child.tagName === 'img') {
				buffer += ` ${String(child.properties['alt'] ?? '')} `;
			} else if (INLINE.has(child.tagName)) {
				child.children.forEach(collect);
			} else {
				flush();
				visit(child, nextColumn);
			}
		};

		node.children.forEach(collect);
		flush();
	}

	visit(article, 'default');
	// 번역이 있는 대역 페이지는 한국어 칸만 색인한다. 영어 원문까지 넣으면 색인이 두 배가 된다.
	const translated = blocks.some((block) => block.column === 'ko');
	return blocks
		.filter((block) => !(translated && block.column === 'en'))
		.map(({ column: _, ...block }) => block);
}

function pageTitle(raw: string | null, url: string): string {
	if (!raw) return url;
	// "당신의 진실 [철의 맹세] 🚀 사이트" → "당신의 진실"
	return squash(raw.split(' 🚀 ')[0]!).replace(/\s*\[[^\]]+\]$/, '') || url;
}

function commonPath(links: string[]): string {
	const [first = [], ...rest] = links.map((link) => link.split('/').filter(Boolean));
	let length = first.length;
	for (const segments of rest) {
		let i = 0;
		while (i < length && segments[i] === first[i]) i++;
		length = i;
	}
	return first.slice(0, length).join('/');
}

/**
 * 분류 이름: 왼쪽 메뉴에서 링크들의 공통 경로가 꼭 /<언어>/<분류>인 주제의 이름 → 분류 첫 페이지의
 * 제목 → 분류 키 순으로 찾는다. (던전월드 2처럼 /ko/awe/dw2 아래만 가리키는 주제는 awe 전체의 이름이 아니다.)
 */
function sectionTitle(section: string, indexTitle: string | undefined): string {
	for (const [lang, topics] of Object.entries(SIDEBAR)) {
		for (const [label, children] of Object.entries(topics)) {
			if (commonPath(children.map((child) => child.link)) === `${lang}/${section}`) return label;
		}
	}
	return indexTitle ?? section;
}

async function* htmlFiles(dir: string): AsyncGenerator<string> {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* htmlFiles(full);
		else if (entry.name.endsWith('.html')) yield full;
	}
}

function urlFor(distDir: string, file: string): string {
	const rel = path.relative(distDir, file).split(path.sep).join('/');
	return '/' + rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '/');
}

async function buildIndexes(distDir: string, log: (msg: string) => void) {
	type Section = { pages: SearchPage[]; blocks: SearchBlock[] };
	const sections = new Map<string, Section>();
	const sectionTitles: Record<string, string> = {};

	for await (const file of htmlFiles(distDir)) {
		const url = urlFor(distDir, file);
		const section = sectionOf(url);
		if (!section) continue;
		const tree: Root = fromHtml(await readFile(file, 'utf8'));
		const title = pageTitle(findTitle(tree), url);
		// 분류의 첫 페이지(/ko/<분류>/)의 제목을 분류 이름으로 쓴다.
		if (url === `/${url.split('/')[1]}/${section}/`) sectionTitles[section] = title;

		// 캐릭터 시트처럼 본문(#article)이 없는 페이지는 검색 대상이 아니다.
		const article = findArticle(tree);
		if (!article) continue;

		let entry = sections.get(section);
		if (!entry) sections.set(section, (entry = { pages: [], blocks: [] }));
		const p = entry.pages.push({ url, title }) - 1;
		for (const block of extractBlocks(article)) entry.blocks.push({ id: entry.blocks.length, p, ...block });
	}

	const outDir = path.join(distDir, SEARCH_BASE);
	await rm(outDir, { recursive: true, force: true });
	await mkdir(outDir, { recursive: true });

	const manifest: SearchManifest = { version: Date.now().toString(36), sections: {} };
	for (const [section, { pages, blocks }] of sections) {
		const document = new Document<SearchBlock>(createSearchOptions(Charset));
		for (const block of blocks) document.add(block);
		const exported: Record<string, string> = {};
		await document.export((key, data) => {
			exported[key] = data;
		});
		// 내보낸 값은 JSON 문자열이다. 문자열째 다시 JSON에 넣으면 따옴표가 모두 이스케이프되므로 풀어서 넣는다.
		const index = Object.fromEntries(Object.entries(exported).map(([key, data]) => [key, JSON.parse(data) as unknown]));
		const file: SearchSectionFile = { pages, index };
		const json = JSON.stringify(file);
		await writeFile(path.join(outDir, `${section}.json`), json);
		manifest.sections[section] = { title: sectionTitle(section, sectionTitles[section]), pages: pages.length };
		log(`${section}: ${pages.length} pages, ${blocks.length} blocks, ${(json.length / 1024).toFixed(0)} KiB`);
	}
	await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest));
}

export default function searchIndex(): AstroIntegration {
	let distDir = '';
	return {
		name: 'search-index',
		hooks: {
			'astro:config:done': ({ config }) => {
				distDir = fileURLToPath(config.outDir);
			},
			'astro:server:setup': ({ server }) => {
				server.middlewares.use(SEARCH_BASE, (req, res, next) => {
					const name = decodeURIComponent((req.url ?? '').split('?')[0]!).replace(/^\/+/, '');
					const file = path.join(distDir, SEARCH_BASE, name);
					if (!/^[^/\\]+\.json$/.test(name) || !existsSync(file)) return next();
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					createReadStream(file).pipe(res);
				});
			},
			'astro:build:done': async ({ dir, logger }) => {
				await buildIndexes(fileURLToPath(dir), (msg) => logger.info(msg));
			},
		},
	};
}
