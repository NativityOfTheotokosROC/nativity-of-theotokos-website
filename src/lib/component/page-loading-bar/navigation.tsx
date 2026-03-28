import {
	Link as LocalizedLink,
	usePathname,
	useRouter,
} from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { QueryParams } from "next-intl/navigation";
import { ComponentProps, useContext } from "react";
import { PageLoadingBarContext } from "./PageLoadingBar";

function triggerLoading(
	pathName: string,
	href: string | { pathname: string; query?: QueryParams | undefined },
	localeInfo?: { currentLocale: string; targetLocale: string | undefined },
) {
	if (
		localeInfo?.targetLocale &&
		localeInfo.currentLocale != localeInfo.targetLocale
	)
		return true;
	const destinationPathname =
		typeof href == "string"
			? new URL(href, window.location.origin).pathname
			: href.pathname;
	return destinationPathname != pathName;
}

export function usePageLoadingBarRouter<T extends typeof useRouter>(
	useRouterHook: T,
) {
	const router = useRouterHook();
	const pathName = usePathname();
	const locale = useLocale();
	const { interact } = useContext(PageLoadingBarContext);
	return {
		...router,
		async push(href, options?) {
			router.push(href, options);
			if (
				triggerLoading(pathName, href, {
					currentLocale: locale,
					targetLocale: options?.locale,
				})
			) {
				await interact({
					type: "SET_LOADING",
					input: { value: false },
				});
				await interact({ type: "SET_LOADING", input: { value: true } });
			}
		},
		async forward() {
			router.forward();
			await interact({ type: "SET_LOADING", input: { value: false } });
			await interact({ type: "SET_LOADING", input: { value: true } });
		},
		async back() {
			router.back();
			await interact({ type: "SET_LOADING", input: { value: false } });
			await interact({ type: "SET_LOADING", input: { value: true } });
		},
		async replace(href, options?) {
			router.replace(href, options);
			if (
				triggerLoading(pathName, href, {
					currentLocale: locale,
					targetLocale: options?.locale,
				})
			) {
				await interact({
					type: "SET_LOADING",
					input: { value: false },
				});
				await interact({ type: "SET_LOADING", input: { value: true } });
			}
		},
	} satisfies typeof router;
}

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
