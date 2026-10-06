/** @jsxImportSource preact */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Document } from 'flexsearch';
import {
	createSearchOptions,
	sectionOf,
	SEARCH_BASE,
	SEARCH_LIMIT,
	type SearchBlock,
	type SearchManifest,
	type SearchPage,
	type SearchSectionFile,
} from '../../search/shared';

type LoadedSection = { key: string; pages: SearchPage[]; index: Document<SearchBlock> };
type Result = { key: string; page: SearchPage; block: SearchBlock };
type Segment = { text: string; mark: boolean };

/** 분류별 색인은 한 번만 받아 둔다(같은 페이지 안에서 대화창을 여러 번 열어도). */
const sectionCache = new Map<string, Promise<LoadedSection>>();
let manifestCache: Promise<SearchManifest> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${url}: ${response.status}`);
	return (await response.json()) as T;
}

function loadManifest(): Promise<SearchManifest> {
	manifestCache ??= fetchJson<SearchManifest>(`${SEARCH_BASE}/manifest.json`).catch((error: unknown) => {
		manifestCache = null;
		throw error;
	});
	return manifestCache;
}

function loadSection(key: string, version: string): Promise<LoadedSection> {
	let cached = sectionCache.get(key);
	if (!cached) {
		cached = (async () => {
			const [{ Charset, Document }, file] = await Promise.all([
				import('flexsearch'),
				fetchJson<SearchSectionFile>(`${SEARCH_BASE}/${encodeURIComponent(key)}.json?v=${version}`),
			]);
			const index = new Document<SearchBlock>(createSearchOptions(Charset));
			for (const [name, data] of Object.entries(file.index)) index.import(name, data as string);
			return { key, pages: file.pages, index };
		})();
		cached.catch(() => sectionCache.delete(key));
		sectionCache.set(key, cached);
	}
	return cached;
}

function search(sections: LoadedSection[], query: string): Result[] {
	const results: Result[] = [];
	for (const section of sections) {
		const found = section.index.search(query, { limit: SEARCH_LIMIT, enrich: true });
		for (const field of found) {
			for (const item of field.result) {
				const block = item.doc as SearchBlock | null;
				const page = block ? section.pages[block.p] : undefined;
				if (block && page) results.push({ key: section.key, page, block });
			}
		}
	}
	return results.slice(0, SEARCH_LIMIT);
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** 첫 일치 앞뒤만 잘라 보여 주고, 검색어와 같은 부분을 <mark>로 나눈다. */
function highlight(text: string, query: string, before = 30, length = 140): Segment[] {
	const terms = query.split(/\s+/).filter(Boolean).sort((a, b) => b.length - a.length);
	if (!terms.length) return [{ text, mark: false }];
	const pattern = new RegExp(terms.map(escapeRegExp).join('|'), 'gi');

	const first = text.search(pattern);
	let start = first > before ? first - before : 0;
	let end = Math.min(text.length, start + length);
	if (end - start < length) start = Math.max(0, end - length);
	let snippet = text.slice(start, end);
	if (start > 0) snippet = '…' + snippet;
	if (end < text.length) snippet += '…';

	const segments: Segment[] = [];
	let last = 0;
	for (const match of snippet.matchAll(pattern)) {
		if (match.index > last) segments.push({ text: snippet.slice(last, match.index), mark: false });
		segments.push({ text: match[0], mark: true });
		last = match.index + match[0].length;
	}
	if (last < snippet.length) segments.push({ text: snippet.slice(last), mark: false });
	return segments;
}

function hrefOf({ page, block }: Result): string {
	return block.a ? `${page.url}#${encodeURIComponent(block.a)}` : page.url;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

const SearchIcon = ({ className = '' }: { className?: string }) => (
	<svg class={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
);

export default function SearchDialog({ pathname }: { pathname: string }) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [sections, setSections] = useState<LoadedSection[] | null>(null);
	const [scope, setScope] = useState<string | null>(null);
	const [error, setError] = useState(false);
	const [active, setActive] = useState(0);

	const show = () => {
		dialogRef.current?.showModal();
		setOpen(true);
		inputRef.current?.focus();
		inputRef.current?.select();
	};

	// ⌘K / Ctrl+K, 또는 입력 중이 아닐 때 "/"로 연다.
	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			const typing = target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '');
			if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
				event.preventDefault();
				if (dialogRef.current?.open) dialogRef.current.close();
				else show();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	// 처음 열 때 현재 분류의 색인을 받는다. 분류 밖이나 페이지가 하나뿐인 분류(환영 페이지 등)에서는 모든 분류를 찾는다.
	useEffect(() => {
		if (!open || sections) return;
		setError(false);
		(async () => {
			const manifest = await loadManifest();
			const current = sectionOf(pathname);
			const keys = current && (manifest.sections[current]?.pages ?? 0) > 1 ? [current] : Object.keys(manifest.sections);
			setScope(keys.length === 1 ? manifest.sections[keys[0]!]!.title : null);
			setSections(await Promise.all(keys.map((key) => loadSection(key, manifest.version))));
		})().catch((e: unknown) => {
			console.error('[search]', e);
			setError(true);
		});
	}, [open, sections, pathname]);

	const results = useMemo(() => (sections && query.trim() ? search(sections, query.trim()) : []), [sections, query]);

	useEffect(() => setActive(0), [results]);
	useEffect(() => {
		listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
	}, [active]);

	const go = (result: Result) => {
		dialogRef.current?.close();
		window.location.href = hrefOf(result);
	};

	const onInputKey = (event: KeyboardEvent) => {
		if (event.isComposing) return; // 한글 조합 중 Enter는 글자를 확정하는 키다.
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setActive((i) => (results.length ? (i + 1) % results.length : 0));
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
		} else if (event.key === 'Enter' && results[active]) {
			event.preventDefault();
			go(results[active]);
		}
	};

	const trimmed = query.trim();
	const status = error
		? '검색 색인을 불러오지 못했습니다.'
		: !sections
			? '검색 색인을 불러오는 중…'
			: !trimmed
				? '검색어를 입력하세요.'
				: !results.length
					? '검색 결과가 없습니다.'
					: null;

	return (
		<>
			<button
				type="button"
				class="btn btn-sm btn-ghost border-base-300 bg-base-200/50 text-base-content/60 hover:text-base-content h-9 justify-start gap-2 font-normal max-sm:btn-square sm:w-56"
				onClick={show}
				aria-label="검색"
			>
				<SearchIcon className="size-4 shrink-0" />
				<span class="max-sm:hidden grow text-left">검색…</span>
				<kbd class="kbd kbd-sm max-sm:hidden">{isMac ? '⌘' : 'Ctrl'} K</kbd>
			</button>

			<dialog ref={dialogRef} class="modal items-start pt-[12vh]" onClose={() => setOpen(false)} aria-label="사이트 검색">
				<div class="modal-box w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-xl border border-base-300 p-0 shadow-2xl">
					<div class="flex items-center gap-2 border-b border-base-300 px-3">
						<SearchIcon className="size-4 shrink-0 opacity-50" />
						<input
							ref={inputRef}
							type="text"
							class="h-12 w-full grow bg-transparent text-base outline-none placeholder:text-base-content/50"
							placeholder={scope ? `${scope}에서 검색…` : '검색…'}
							value={query}
							onInput={(event) => setQuery((event.target as HTMLInputElement).value)}
							onKeyDown={onInputKey}
							role="combobox"
							aria-expanded={results.length > 0}
							aria-controls="search-results"
							aria-activedescendant={results.length ? `search-result-${active}` : undefined}
							autocomplete="off"
							spellcheck={false}
						/>
						{scope && <span class="badge badge-soft badge-primary badge-sm shrink-0 whitespace-nowrap">{scope}</span>}
					</div>

					{status ? (
						<p class="py-10 text-center text-sm text-base-content/60">{status}</p>
					) : (
						<ul ref={listRef} id="search-results" role="listbox" class="max-h-[min(60vh,28rem)] overflow-y-auto p-1.5">
							{results.map((result, i) => (
								<li key={`${result.key}:${result.block.id}`} role="option" id={`search-result-${i}`} aria-selected={i === active} data-index={i}>
									<a
										href={hrefOf(result)}
										/* 전역 a 스타일(밑줄·색)이 레이어 밖에 있어 !로 덮는다. */
										class={`block rounded-md px-3 py-2 text-base-content! no-underline! outline-none! ${i === active ? 'bg-base-content/10' : ''}`}
										onMouseMove={() => setActive(i)}
										onClick={(event) => {
											event.preventDefault();
											go(result);
										}}
									>
										<div class="flex items-baseline gap-1.5 text-xs text-base-content/60">
											<span class="truncate font-semibold">{result.page.title}</span>
											{result.block.h && (
												<>
													<span aria-hidden="true">›</span>
													<span class="truncate">{result.block.h}</span>
												</>
											)}
										</div>
										<p class="mt-0.5 line-clamp-2 text-sm leading-snug">
											{highlight(result.block.t, trimmed).map((segment) =>
												segment.mark ? <mark class="rounded-sm bg-warning/40 px-0.5 text-inherit">{segment.text}</mark> : segment.text,
											)}
										</p>
									</a>
								</li>
							))}
						</ul>
					)}

					<div class="flex items-center gap-3 border-t border-base-300 px-3 py-2 text-xs text-base-content/50">
						<span><kbd class="kbd kbd-xs">↑</kbd> <kbd class="kbd kbd-xs">↓</kbd> 이동</span>
						<span><kbd class="kbd kbd-xs">Enter</kbd> 열기</span>
						<span><kbd class="kbd kbd-xs">Esc</kbd> 닫기</span>
						{results.length > 0 && <span class="ml-auto">상위 {results.length}개</span>}
					</div>
				</div>
				<form method="dialog" class="modal-backdrop">
					<button type="submit">닫기</button>
				</form>
			</dialog>
		</>
	);
}
