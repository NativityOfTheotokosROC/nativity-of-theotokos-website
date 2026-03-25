"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { PageLoadingBarModel } from "../../model/page-loading-bar";
import LoadingBar from "../loading-bar/LoadingBar";
import { usePathname } from "@/src/i18n/navigation";

export const PageLoadingBarContext = createContext<PageLoadingBarModel>({
	interact: async function () {
		throw new Error("The context is uninitialized");
	},
	modelView: null,
});

const PageLoadingBar = function () {
	const { modelView, interact } = useContext(PageLoadingBarContext);
	const currentPathName = usePathname();
	const [initialPathName, setInitialPathName] = useState(currentPathName);

	const handler = useCallback(async () => {
		setInitialPathName(currentPathName);
		await interact({ type: "SET_LOADING", input: { value: false } });
	}, [currentPathName, interact]);

	useEffect(() => {
		window.addEventListener("popstate", handler);
	}, [handler]);

	useEffect(() => {
		if (initialPathName != currentPathName) {
			window.dispatchEvent(new PopStateEvent("popstate"));
		}
	}, [currentPathName, initialPathName]);

	return (
		<div className="bg-gray-900 h-fit w-full sticky top-0 z-29">
			<LoadingBar model={{ modelView }} />
		</div>
	);
};

export default PageLoadingBar;
