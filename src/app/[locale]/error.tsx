"use client";

import { routing } from "@/src/i18n/routing";
import { PageLoadingBarContext } from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { errorPageVIInterface } from "@/src/lib/model-implementation/error-page";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { useContext, useEffect } from "react";
import ErrorPage from "./error-page/ErrorPage";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "error",
	});

	return {
		title: t("metaTitle"),
	};
}

export default function Page({
	error,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const message = error.digest ? `digest: ${error.digest}` : error.message;
	const pageLoadingBar = useContext(PageLoadingBarContext);
	const { modelView: errorPageModelView, interact: errorPageInteract } =
		useInitializedStatefulInteractiveModel(
			errorPageVIInterface(() => {
				window.location.reload();
			}, pageLoadingBar),
			{ message },
		);

	useEffect(() => {
		if (message != errorPageModelView.message)
			errorPageInteract({ type: "REPORT_ERROR", input: { message } });
	}, [errorPageInteract, errorPageModelView.message, message]);

	return (
		<ErrorPage
			model={{
				modelView: errorPageModelView,
				interact: errorPageInteract,
			}}
		/>
	);
}
