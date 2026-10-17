/** @jsxImportSource preact */

import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { MarkdownHeading } from 'astro';

/** 오른쪽 "이 페이지" 목차. 스크롤하면 지금 읽는 제목을 진하게 표시한다. */
const TableOfContents: FunctionalComponent<{ headings: MarkdownHeading[] }> = ({ headings = [] }) => {
	const items = headings.filter(({ depth }) => depth > 1 && depth < 4);
	const [activeId, setActiveId] = useState<string>(items[0]?.slug ?? '');

	useEffect(() => {
		const targets = items
			.map(({ slug }) => document.getElementById(slug))
			.filter((element): element is HTMLElement => element !== null);
		if (!targets.length) return;

		const onScroll = () => {
			// 화면 위쪽 1/4을 지난 마지막 제목이 지금 읽는 곳이다.
			const line = window.innerHeight / 4;
			let current = targets[0]!.id;
			for (const target of targets) {
				if (target.getBoundingClientRect().top > line) break;
				current = target.id;
			}
			setActiveId(current);
		};

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	if (!items.length) return null;

	return (
		<div class="toc">
			<p class="toc-title">이 페이지</p>
			<ol>
				{items.map((heading) => (
					<li class={`depth-${heading.depth}`}>
						<a href={`#${heading.slug}`} aria-current={activeId === heading.slug ? 'true' : undefined}>
							{heading.text}
						</a>
					</li>
				))}
			</ol>
		</div>
	);
};

export default TableOfContents;
