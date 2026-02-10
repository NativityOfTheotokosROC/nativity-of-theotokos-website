import {
	useRouter,
	usePathname,
	Link as LocalizedLink,
} from "@/src/i18n/navigation";
import { ComponentProps, useContext } from "react";
import { LoadingBarContext } from "./LoadingBar";
import { QueryParams } from "next-intl/navigation";
import { useLocale } from "next-intl";

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

export function useLoadingBarRouter<T extends typeof useRouter>(
	useRouterHook: T,
) {
	const router = useRouterHook();
	const pathName = usePathname();
	const locale = useLocale();
	const { interact } = useContext(LoadingBarContext);
	return {
		...router,
		push(href, options?) {
			router.push(href, options);
			if (
				triggerLoading(pathName, href, {
					currentLocale: locale,
					targetLocale: options?.locale,
				})
			)
				interact({ type: "SET_LOADING", input: { value: true } });
		},
		replace(href, options?) {
			router.replace(href, options);
			if (
				triggerLoading(pathName, href, {
					currentLocale: locale,
					targetLocale: options?.locale,
				})
			)
				interact({ type: "SET_LOADING", input: { value: true } });
		},
	} satisfies typeof router;
}

export function Link(props: ComponentProps<typeof LocalizedLink>) {
	const { href, locale } = props;
	const pathName = usePathname();
	const currentLocale = useLocale();
	const { interact } = useContext(LoadingBarContext);

	return (
		<LocalizedLink
			{...props}
			onClick={e => {
				if (
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
