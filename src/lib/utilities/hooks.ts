import "client-only";
import { useEffect } from "react";

function beforeUnloadHandler(e: BeforeUnloadEvent) {
	e.preventDefault();
}

export function useCloseWarning<T>(valuePredicates?: [T, T][]) {
	useEffect(() => {
		if (!valuePredicates?.length) {
			window.addEventListener("beforeunload", beforeUnloadHandler);
			return;
		}
		if (
			!valuePredicates.every(
				valuePredicate => valuePredicate[0] === valuePredicate[1],
			)
		) {
			window.addEventListener("beforeunload", beforeUnloadHandler);
		} else {
			window.removeEventListener("beforeunload", beforeUnloadHandler);
		}
	}, [valuePredicates]);
}
