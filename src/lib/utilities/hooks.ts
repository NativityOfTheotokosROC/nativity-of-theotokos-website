import "client-only";
import { useEffect } from "react";

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
	}, [predicate]);
}
