export const SITE = {
	title: '스텔로의 토끼굴',
	description: '서로 다른 이들이 함께 나아가는 TRPG를 탐구하는 블로그',
	defaultLanguage: 'ko_KR',
};

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: 'stelo_kim',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
	title: string;
	description: string;
	layout: string;
	image?: { src: string; alt: string };
	dir?: 'ltr' | 'rtl';
	ogLocale?: string;
	lang?: string;
};

export const KNOWN_LANGUAGES = {
	Korean: 'ko',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/twinstae/trpg-stelo/tree/main/`;

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
	ko: Language('ko', [
	
		Topic('누메네라', '/numenera', [
			{ text: '지도', link: '/introduction' },
			{ text: '조화: 확장 규칙', link: '/harmony' },
			{ text: '일레인: 공동체', link: '/elaine-community' },
			{ text: '기록', link: '/record' },
			// { text: '죽은 새들의 언어: 시나리오', link: '/dead-birds-language' },
			// { text: '아키펠라고', link: '/archipelago' },
		]),
		// Topic('약을 전하는 여행', '/fellowship-of-the-medicine', [
		// 	{ text: '소개', link: '/introduction' },
		// 	{ text: '겁스 경량판 어댑터', link: '/gurps-light' },
		// 	// { text: '누메네라 어댑터', link: '/numenera' },
		// 	// { text: '던전월드 어댑터', link: '/dungeon-world' },
		// ]),
		// Topic('크툴루 컨피덴셜', '/cthulhu-confidential', [
		// 	{ text: '지도', link: '/map' },
		// 	// { text: '푸른 그림자: 시나리오', link: '/blue-shadow' }
		// ]),
		// Topic('리플레이', '/replay', [
		// 	{ text: '소개', link: '/numenera-01' }
		// ]),
		Topic('노트', '/note', [
			{ text: '이야기 속 현실과 논리', link: '/reality-and-logic' },
			{ text: '이야기 속 현실 사전', link: '/realistic-story-dict' },
			// { text: '불가능 부수기', link: '/breaking-impossible' },
			// { text: 'TRPG에서 폭력과 힘', link: '/power-in-trpg' },
			// { text: '음유시인의 후예', link: '/descendants-of-bard' },
			// { text: '구경 책임제', link: '/diameter-responsibility-rule' }
		]),
		// Topic('프랙탈', '/fractal', [
		// 	{ text: '잿불 퀵스타트', link: '/quickstart' }
		// ]),
	])
};

type Child = {
	text: string;
	link: string;
}

function Language(base: string, topicList: [string, Child[]][]) {
	return Object.fromEntries(topicList.map(([label, children]) => [label, children.map(child => ({
		...child,
		link: base + child.link
	}))]))
}

function Topic(label: string, base: string, children: Child[]): [string, Child[]] {
	return [
		label, children.map(child => ({
			...child,
			link: base + child.link
		})),
	]
}