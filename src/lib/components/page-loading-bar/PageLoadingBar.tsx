"use client";

import {
	ComponentProps,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { PageLoadingBarModel } from "../../models/page-loading-bar";
import LoadingBar from "../loading-bar/LoadingBar";
import { Link as LocalizedLink, usePathname } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { triggerLoading } from "../../utilities/page-loading-bar";

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
		<div className="sticky top-0 z-29 h-fit w-full bg-gray-900">
			<LoadingBar model={{ modelView }} />
		</div>
	);
};

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

export default PageLoadingBar;
