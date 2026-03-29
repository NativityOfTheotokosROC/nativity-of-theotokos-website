"use client";

import {
	ComponentProps,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { PageLoadingBarModel } from "../../model/page-loading-bar";
import LoadingBar from "../loading-bar/LoadingBar";
import { Link as LocalizedLink, usePathname } from "@/src/i18n/navigation";
import { default as useLocale } from "next-intl";
import { triggerLoading } from "../../utility/page-loading-bar";

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
export function Link(props: ComponentProps<typeof LocalizedLink>) {
	const { href, locale } = props;
	const pathName = usePathname();
	const currentLocale = useLocale();
	const { interact } = useContext(PageLoadingBarContext);

	return (
		<LocalizedLink
			{...props}
			onClick={e => {
				if (
					props.target !== "_blank" &&
					triggerLoading(pathName, href.toString(), {
						currentLocale,
						targetLocale: locale,
					})
				)
					interact({ type: "SET_LOADING", input: { value: true } });
				props.onClick?.(e);
			}}
		>
			{props.children}
		</LocalizedLink>
	);
}
