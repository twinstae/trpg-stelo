/** @jsxImportSource preact */
import type { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';

/** 좁은 화면에서 왼쪽 메뉴를 서랍처럼 연다. <body class="nav-open">을 레이아웃 CSS가 읽는다. */
const MenuToggle: FunctionalComponent = () => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		document.body.classList.toggle('nav-open', open);
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open]);

	return (
		<button
			type="button"
			class="icon-button"
			aria-expanded={open ? 'true' : 'false'}
			aria-controls="site-nav"
			aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
			onClick={() => setOpen(!open)}
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
				{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
			</svg>
		</button>
	);
};

export default MenuToggle;
