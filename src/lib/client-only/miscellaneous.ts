import { useEffect } from "react";

export function scrollToElement(selector: string) {
	const target = document.querySelector(selector);
	if (!target) return;
	target?.scrollIntoView({
		behavior: "smooth",
	});
}

function beforeUnloadHandler(e: BeforeUnloadEvent) {
	e.preventDefault();
}

export function useCloseWarning(predicate?: () => boolean) {
	useEffect(() => {
		if (!predicate) {
			window.addEventListener("beforeunload", beforeUnloadHandler);
			return;
		}
		if (predicate()) {
			window.addEventListener("beforeunload", beforeUnloadHandler);
		} else {
			window.removeEventListener("beforeunload", beforeUnloadHandler);
		}
		return () => {
			window.removeEventListener("beforeunload", beforeUnloadHandler);
		};
	}, [predicate]);
}
