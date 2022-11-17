/** @jsxImportSource preact */

import type { FunctionalComponent } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import type { MarkdownHeading } from 'astro';

type ItemOffsets = {
	id: string;
	text: string;
	topOffset: number;
};

const TableOfContents: FunctionalComponent<{ headings: MarkdownHeading[] }> = ({
	headings = [],
}) => {
	const itemOffsets = useRef<ItemOffsets[]>([]);
	// FIXME: Not sure what this state is doing. It was never set to anything truthy.
	const [activeId, setActiveId] = useState<string>('');
	useEffect(() => {
		const getItemOffsets = () => {
			const titles = document.querySelectorAll('article :is(h2, h3, h4)');
			const base = titles[1]?.getBoundingClientRect().top || 0
			itemOffsets.current = Array.from(titles).slice(1).map((title) => ({
				id: title.id,
				text: title.textContent ?? '',
				topOffset: title.getBoundingClientRect().top - base,
			}));
		};

		const onScroll = () => {
			const id = itemOffsets.current.find(item => item.topOffset > window.scrollY)?.id || 'overview';
			setActiveId(id);
		};

		getItemOffsets();

		window.addEventListener("scroll", onScroll)

		window.addEventListener('resize', getItemOffsets);

		return () => {
			window.removeEventListener('resize', getItemOffsets);
			window.removeEventListener("scroll", onScroll)
		};
	}, []);

	return (
		<div className="overflow-y-scroll">
			<h2 className="heading">목차</h2>
			<ul>
				<li className={`heading-link depth-2 ${activeId === 'overview' ? 'active' : ''}`.trim()}>
					<a href="#overview" className="no-underline">도입</a>
				</li>
				{headings
					.filter(({ depth }) => depth > 1 && depth < 4)
					.map((heading) => (
						<li
							className={`heading-link depth-${heading.depth} ${
								activeId === heading.slug ? 'active' : ''
							}`.trim()}
						>
							<a href={`#${heading.slug}`} className="no-underline">{heading.text}</a>
						</li>
					))}
			</ul>
		</div>
	);
};

export default TableOfContents;
