export function scrollToSelected(selector: string) {
	const target = document.querySelector(selector);
	if (!target) return;
	target?.scrollIntoView({
		behavior: "smooth",
	});
}
