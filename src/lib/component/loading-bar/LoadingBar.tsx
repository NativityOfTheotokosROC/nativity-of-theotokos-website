"use client";

import { LoadingBarModel } from "../../model/loading-bar";
import "./loading-bar.css";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const LoadingBarContext = createContext<LoadingBarModel>({
	interact: async function () {
		throw new Error("Function not implemented.");
	},
	modelView: null,
});

export function useLoadingBarRouter<T extends typeof useRouter>(
	useRouterHook: T,
) {
	const router = useRouterHook();
	const { interact } = useContext(LoadingBarContext);
	return {
		...router,
		push(href, options?) {
			router.push(href, options);
			interact({ type: "SET_LOADING", input: { value: true } });
		},
		replace(href, options?) {
			router.replace(href, options);
			interact({ type: "SET_LOADING", input: { value: true } });
		},
	} satisfies typeof router;
}

const LoadingBar = function () {
	const { modelView, interact } = useContext(LoadingBarContext);
	const currentPathName = usePathname();
	const [initialPathName, setInitialPathName] = useState(currentPathName);

	useEffect(() => {
		const _ = async () => {
			if (initialPathName != currentPathName && modelView?.isLoading) {
				await interact({
					type: "SET_LOADING",
					input: { value: false },
				});
				setInitialPathName(currentPathName);
			}
		};
		_();
	}, [currentPathName, initialPathName, interact, modelView?.isLoading]);

	return (
		<div
			className={`loading-bar h-px bg-[#dcb042] sticky top-0 z-11 ${!modelView?.isLoading && "hidden"}`}
		/>
	);
};

export default LoadingBar;
