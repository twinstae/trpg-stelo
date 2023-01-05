import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, d as renderComponent, $ as $$HeadCommon, e as $$HeadSEO, S as SITE, f as renderHead, g as renderSlot } from '../entry.mjs';
import 'html-escaper';
import '@astrojs/netlify/netlify-functions.js';
import 'preact';
import 'preact-render-to-string';
import 'mime';
import 'sharp';
/* empty css                          *//* empty css                                     *//* empty css                                */import 'preact/hooks';
import 'preact/jsx-runtime';
import 'http-cache-semantics';
import 'kleur/colors';
import 'node:fs/promises';
import 'node:os';
import 'node:path';
import 'node:url';
import 'magic-string';
import 'node:stream';
import 'slash';
import 'image-size';
/* empty css                                            *//* empty css                                     */import 'cookie';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const $$Astro = createAstro("/home/taehee/trpg/trpg-stelo/src/layouts/BaseLayout.astro", "http://astro.build/", "file:///home/taehee/trpg/trpg-stelo/");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { frontmatter } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  return renderTemplate`<html${addAttribute(frontmatter.dir ?? "ltr", "dir")}${addAttribute(frontmatter.lang ?? "en-us", "lang")} class="initial" data-theme="garden">
	<head>
		${renderComponent($$result, "HeadCommon", $$HeadCommon, {})}
		${renderComponent($$result, "HeadSEO", $$HeadSEO, { "frontmatter": frontmatter, "canonicalUrl": canonicalURL })}
		<link rel="me" href="https://dice.camp/@stelo">
		<title>
			${frontmatter.title ? `${frontmatter.title} \u{1F680} ${SITE.title}` : SITE.title}
		</title>
	${renderHead($$result)}</head>

	<body>
    ${renderSlot($$result, $$slots["default"])}
	</body></html>`;
}, "/home/taehee/trpg/trpg-stelo/src/layouts/BaseLayout.astro");

const $$file = "/home/taehee/trpg/trpg-stelo/src/layouts/BaseLayout.astro";
const $$url = undefined;

export { $$BaseLayout as default, $$file as file, $$url as url };
