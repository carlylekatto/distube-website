/**
 * The two elements of the table of contents.
 *
 * They are the elements of Starlight, copied so that the list inside can carry
 * the badge of the kind of a member. Starlight defines the desktop one as a
 * side effect of the module of the mobile one, which is a link that this site
 * does not want to depend on, so both are defined here.
 *
 * The source: @astrojs/starlight/dist/components-internals/TableOfContents/
 */

const PAGE_TITLE_ID = "_top";

export class StarlightTOC extends HTMLElement {
	private currentLink: HTMLAnchorElement | null = this.querySelector('a[aria-current="true"]');
	private minH = Number.parseInt(this.dataset.minH || "2", 10);
	private maxH = Number.parseInt(this.dataset.maxH || "3", 10);

	private tocHeadingSelector = `h1#${PAGE_TITLE_ID},:where(${Array.from({ length: 1 + this.maxH - this.minH })
		.map((_, index) => `h${this.minH + index}`)
		.join()})[id]`;

	set current(link: HTMLAnchorElement) {
		if (link === this.currentLink) return;
		this.currentLink?.removeAttribute("aria-current");
		link.setAttribute("aria-current", "true");
		this.currentLink = link;
	}

	private onIdle = (cb: () => void) =>
		(window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1)))(cb) as unknown as void;

	constructor() {
		super();
		this.onIdle(() => this.init());
	}

	private init = () => {
		/** The links of the table of contents. */
		const links = [...this.querySelectorAll("a")];

		/** Test if an element is a heading of the table of contents. */
		const isHeading = (el: Element) => el.matches(this.tocHeadingSelector);

		/** Walk up the DOM to find the heading that holds an element. */
		const getElementHeading = (start: Element | null): Element | null => {
			let el = start;
			while (el) {
				if (el.matches(".sl-markdown-content, main > *")) return document.getElementById(PAGE_TITLE_ID);
				if (isHeading(el)) return el;

				const childHeading = el.querySelector(this.tocHeadingSelector);
				if (childHeading) return childHeading;

				let prev = el.previousElementSibling;
				while (prev?.lastElementChild) prev = prev.lastElementChild;
				el = prev ?? el.parentElement;
			}
			return null;
		};

		/** Make the link of the heading the current one. */
		const setCurrent = (entries: IntersectionObserverEntry[]) => {
			for (const { isIntersecting, target } of entries) {
				if (!isIntersecting) continue;
				const heading = getElementHeading(target);
				if (!heading) continue;

				const link = links.find((link) => link.hash === `#${encodeURIComponent(heading.id)}`);
				if (link) {
					this.current = link;
					break;
				}
			}
		};

		const toObserve = document.querySelectorAll(
			[
				`main :where(${this.tocHeadingSelector})`,
				`main :where(${this.tocHeadingSelector}, .sl-heading-wrapper) ~ *:not(:has(${this.tocHeadingSelector}))`,
				`main .sl-markdown-content > *:not(:has(${this.tocHeadingSelector}))`,
				`main > *:not(:has(${this.tocHeadingSelector}))`,
			].join(),
		);

		let observer: IntersectionObserver | undefined;

		const observe = () => {
			if (observer) return;
			const created = new IntersectionObserver(setCurrent, { rootMargin: this.getRootMargin() });
			observer = created;
			toObserve.forEach((heading) => created.observe(heading));
		};

		observe();

		let timeout: ReturnType<typeof setTimeout>;

		window.addEventListener("resize", () => {
			observer?.disconnect();
			observer = undefined;
			clearTimeout(timeout);
			timeout = setTimeout(() => this.onIdle(observe), 200);
		});
	};

	private getRootMargin() {
		const top =
			(document.querySelector("header")?.getBoundingClientRect().height || 0) +
			(this.querySelector("summary")?.getBoundingClientRect().height || 0) +
			32;

		return `-${top}px 0% ${top + 53 - document.documentElement.clientHeight}px`;
	}
}

/** The table of contents of a narrow screen. */
export class MobileStarlightTOC extends StarlightTOC {
	override set current(link: HTMLAnchorElement) {
		super.current = link;
		const display = this.querySelector(".display-current");
		if (display) display.textContent = link.textContent;
	}

	constructor() {
		super();

		const details = this.querySelector("details");
		if (!details) return;

		const closeToC = () => {
			details.open = false;
		};

		// The table closes on a link, on a click outside, and on Escape.
		details.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", closeToC);
		});

		window.addEventListener("click", (event) => {
			if (!details.contains(event.target as Node)) closeToC();
		});

		window.addEventListener("keydown", (event) => {
			if (event.key !== "Escape" || !details.open) return;
			const hasFocus = details.contains(document.activeElement);
			closeToC();
			if (hasFocus) details.querySelector("summary")?.focus();
		});
	}
}

/** Define the elements, once, whichever component asks first. */
export function defineTOC() {
	if (!customElements.get("starlight-toc")) customElements.define("starlight-toc", StarlightTOC);
	if (!customElements.get("mobile-starlight-toc")) customElements.define("mobile-starlight-toc", MobileStarlightTOC);
}
