/**
 * 왼쪽 메뉴·경로 표시(breadcrumb)·이전/다음 장 링크가 함께 쓰는 사이트 탐색 구조.
 *
 * 자료(Topic) 아래에 장 링크를 바로 두거나, 책의 큰 부분(Section)으로 묶어 둔다.
 * 링크는 앞의 / 없이 "ko/awe/dw2/the-barbarian"처럼 적는다(검색 색인도 이 모양을 쓴다).
 */

export type NavLink = { text: string; link: string };
export type NavSection = { section: string; items: NavLink[] };
export type NavItem = NavLink | NavSection;

export type NavTopic = {
  label: string;
  /** 자료의 기본 경로. 예: "ko/awe/dw2" */
  base: string;
  items: NavItem[];
};

export function isSection(item: NavItem): item is NavSection {
  return "section" in item;
}

/** 자료의 모든 링크를 메뉴 순서대로 편다. */
export function topicLinks(topic: NavTopic): NavLink[] {
  return topic.items.flatMap((item) => (isSection(item) ? item.items : [item]));
}

/** 기본 경로를 가리키는 링크("목차")가 있으면 그것이 자료의 첫 페이지다. */
export function topicIndex(topic: NavTopic): NavLink | undefined {
  return topicLinks(topic).find((link) => link.link === topic.base);
}

/** 자료를 열 때 갈 곳: 목차가 있으면 목차, 없으면 첫 장. */
export function topicHref(topic: NavTopic): string {
  const first = topicIndex(topic) ?? topicLinks(topic)[0];
  return first ? `/${first.link}` : `/${topic.base}`;
}

/** 목차를 뺀, 차례대로 읽는 장들. 이전/다음 링크는 이 순서를 따른다. */
export function readingOrder(topic: NavTopic): { link: NavLink; section?: string | undefined }[] {
  return topic.items.flatMap((item) =>
    isSection(item)
      ? item.items.map((link) => ({ link, section: item.section }))
      : item.link === topic.base
        ? []
        : [{ link: item }],
  );
}

export function normalizePath(pathname: string): string {
  return pathname.replace(/^\/+/, "").replace(/\/+$/, "");
}

export type NavLocation = {
  topic: NavTopic;
  /** 메뉴에 있는 페이지면 그 링크 */
  link?: NavLink | undefined;
  /** 섹션 안의 페이지면 섹션 이름 */
  section?: string | undefined;
};

/**
 * 지금 페이지가 속한 자료를 찾는다. 메뉴에 그대로 있는 링크를 먼저 찾고,
 * 없으면(시트 하위 페이지 등) 기본 경로가 가장 길게 겹치는 자료를 고른다.
 */
export function locate(topics: NavTopic[], pathname: string): NavLocation | undefined {
  const path = normalizePath(pathname);
  for (const topic of topics) {
    for (const item of topic.items) {
      if (isSection(item)) {
        const link = item.items.find((l) => l.link === path);
        if (link) return { topic, link, section: item.section };
      } else if (item.link === path) {
        return { topic, link: item };
      }
    }
  }
  const byPrefix = topics
    .filter((topic) => path === topic.base || path.startsWith(`${topic.base}/`))
    .sort((a, b) => b.base.length - a.base.length)[0];
  return byPrefix ? { topic: byPrefix } : undefined;
}

export type Crumb = { text: string; href?: string | undefined };

export const LIBRARY_HREF = "/ko/welcome";

/** 자료실 › 자료 › 섹션 › 페이지 */
export function breadcrumb(location: NavLocation | undefined, pageTitle?: string): Crumb[] {
  const crumbs: Crumb[] = [{ text: "자료실", href: LIBRARY_HREF }];
  if (!location) return pageTitle ? [...crumbs, { text: pageTitle }] : crumbs;
  const { topic, link, section } = location;
  const isIndex = link?.link === topic.base;
  crumbs.push({ text: topic.label, href: isIndex ? undefined : topicHref(topic) });
  if (section) crumbs.push({ text: section });
  if (!isIndex) {
    const text = link?.text ?? pageTitle;
    if (text) crumbs.push({ text });
  }
  return crumbs;
}

export type Neighbor = { href: string; text: string; section?: string | undefined };

export function neighbors(location: NavLocation | undefined): { prev?: Neighbor | undefined; next?: Neighbor | undefined } {
  if (!location?.link) return {};
  const order = readingOrder(location.topic);
  const index = order.findIndex((entry) => entry.link.link === location.link!.link);
  if (index < 0) return {};
  const toNeighbor = (entry: (typeof order)[number] | undefined): Neighbor | undefined =>
    entry && { href: `/${entry.link.link}`, text: entry.link.text, section: entry.section };
  return { prev: toNeighbor(order[index - 1]), next: toNeighbor(order[index + 1]) };
}
