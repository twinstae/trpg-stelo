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

export const GITHUB_EDIT_URL = 'https://github.com/twinstae/trpg-stelo/tree/master';

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
	ko: Language('ko', [
		Topic('사이퍼 SRD', '/cypher-open', [
			{ text: '소개', link: '/introduction' },
			{ text: '플레이 하는 법', link: '/how-to-play' },
			{ text: '캐릭터 만들기', link: '/creating-your-character' },
			{ text: '캐릭터 유형', link: '/character-types' },
			{ text: '캐릭터 수식어', link: '/character-descriptors' },
			{ text: '캐릭터 특징', link: '/character-focus' },
			{ text: '캐릭터 특수 능력', link: '/character-abilities' },
			{ text: '장비', link: '/equipment' },
			{ text: '게임의 룰', link: '/rules-of-the-game' },
			{ text: '장르', link: '/genres' },
			{ text: '생물', link: '/creatures' },
			{ text: '사이퍼', link: '/cyphers' },
			{ text: '사이퍼 시스템을 운영하는 법', link: '/running-the-cypher-system' }
		]),
		Topic('누메네라 퀵스타트', '/numenera', [
			{ text: '바다의 재', link: '/ashes-of-the-sea' },
			{ text: '작은 박물지', link: '/mini-bestiary' },
			{ text: '사전 제작 캐릭터', link: '/pregenerated-characters' },
			{ text: '캐릭터 이해하기', link: '/understanding-your-character' },
			{ text: '누메네라를 플레이하는 법', link: '/how-to-play-numenera' },
			{ text: '플레이의 예', link: '/example-of-play' },
			//  { text: '사냥하는 소리의 첨탑: 퀵스타트', link: '/the-spire-of-the-hunting-sound' },
		]),
		Topic('페이트 코어', '/fate-core', [
			{ text: '소개', link: '/introduction' },
			{ text: '1장 기초', link: '/1-basics' },
			{ text: '2장 플레이 설정', link: '/2-game-creation' },
			{ text: '3장 캐릭터 제작', link: '/3-character-creation' },
			{ text: '4장 면모와 운명점', link: '/4-aspects-and-fate-points' },
		]),
		Topic('철의 맹세', '/ironsworn', [
			// { text: '소개', link: '/introduction' },
			{ text: '1장 기초', link: '/1-the-basics' },
		]),
		Topic('자작 자료', '/numenera', [
				{ text: '조화: 확장 규칙', link: '/harmony' },
			// 	{ text: '일레인: 공동체', link: '/elaine-community' },
			// 	{ text: '죽은 새들의 언어: 시나리오', link: '/dead-birds-language' },
		]),
		// Topic('리뷰', '/numenera/reviews', [
		// 	{ text: '구매 안내서', link: '/buy-guide' },
		// 	{ text: '누메네라 코어북', link: '/core-book' },
		// ]),
		Topic('기록', '/numenera/records', [
			{ text: '2022년 4분기', link: '/2022-4q' },
			{ text: '1년 간의 제9세계 일주', link: '/around-the-ninth-world-in-one-year' },
		]),
		// Topic('약을 전하는 여행', '/fellowship-of-the-medicine', [
		// 	{ text: '소개', link: '/introduction' },
		// 	{ text: '겁스 경량판 어댑터', link: '/gurps-light' },
		// 	{ text: '누메네라 어댑터', link: '/numenera' },
		// 	{ text: '던전월드 어댑터', link: '/dungeon-world' },
		// ]),
		// Topic('크툴루 컨피덴셜', '/cthulhu-confidential', [
		// 	{ text: '지도', link: '/map' },
		// 	{ text: '푸른 그림자: 시나리오', link: '/blue-shadow' }
		// ]),
		// Topic('리플레이', '/replay', [
		// 	{ text: '소개', link: '/numenera-01' }
		// ]),
		Topic('노트', '/note', [
			{ text: '이론, 놀이, 이야기', link: '/theory-game-story' },
			{ text: '구경 책임제', link: '/diameter-responsibility-rule' },
			{ text: '개념적 거리', link: '/conceptual-distance' },
			{ text: '정의, 가족 유사성, 분류', link: '/definition-family-resemblance-classification' },
			// { text: '이야기 속 현실과 논리', link: '/reality-and-logic' },
			// { text: '이야기 속 현실 사전', link: '/realistic-story-dict' },
			// { text: '불가능 부수기', link: '/breaking-impossible' },
			// { text: 'TRPG에서 폭력과 힘', link: '/power-in-trpg' },
			// { text: '음유시인의 후예', link: '/descendants-of-bard' },
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