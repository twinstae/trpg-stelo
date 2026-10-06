/**
 * 빌드 때 색인을 만드는 쪽(src/integrations/searchIndex.ts)과 브라우저에서 색인을 읽는 쪽
 * (src/components/Header/SearchDialog.tsx)이 함께 쓰는 약속. FlexSearch는 내보낸 색인을
 * 같은 옵션으로 만든 인스턴스에만 되읽을 수 있으므로 옵션을 한곳에 둔다.
 */
import type { Charset as CharsetType, DocumentOptions } from 'flexsearch';

/** 검색 결과 한 줄이 되는 글 덩어리(문단·목록 항목·표 칸·제목 등). */
export type SearchBlock = {
	id: number;
	/** SearchSectionFile.pages의 위치 */
	p: number;
	/** 덩어리가 속한 제목의 글. 첫 제목보다 앞이면 null */
	h: string | null;
	/** 그 제목의 id. 이동할 때 #앵커로 쓴다 */
	a: string | null;
	/** 덩어리의 글 */
	t: string;
};

export type SearchPage = { url: string; title: string };

/** /search/<분류>.json */
export type SearchSectionFile = {
	pages: SearchPage[];
	/** FlexSearch Document#export가 넘겨준 키와 (JSON.parse한) 값 */
	index: Record<string, unknown>;
};

/** /search/manifest.json */
export type SearchManifest = {
	version: string;
	/** 분류 키(/ko/<키>/…) → 분류 이름과 색인한 페이지 수 */
	sections: Record<string, { title: string; pages: number }>;
};

export const SEARCH_BASE = '/search';
export const SEARCH_LIMIT = 10;

/**
 * flexsearch를 정적으로 불러오면 머리말의 검색 버튼과 함께 실려 오므로, 쓰는 쪽에서 불러온
 * Charset을 넘겨받는다(브라우저는 대화창을 처음 열 때에야 flexsearch를 받는다).
 */
export function createSearchOptions(Charset: typeof CharsetType): DocumentOptions<SearchBlock> {
	return {
		// 한국어는 조사가 낱말 끝에 붙으므로 앞부분 일치("신비가" → "신비가를")가 알맞다.
		tokenize: 'forward',
		encoder: Charset.Default,
		document: {
			id: 'id',
			index: ['t'],
			store: true,
		},
	};
}

/** /ko/<분류>/… 경로에서 분류 키를 꺼낸다. */
export function sectionOf(pathname: string): string | null {
	const match = pathname.match(/^\/[a-z]{2}\/([^/]+)(?:\/|$)/);
	return match ? decodeURIComponent(match[1]!) : null;
}
