"use client";

import { LoadingBarContext } from "@/src/lib/component/loading-bar/LoadingBar";
import { errorPageVIInterface } from "@/src/lib/model-implementation/error-page";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useContext, useEffect, useLayoutEffect } from "react";
import ErrorPage from "./error-page/ErrorPage";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "error" });

	return {
		title: t("metaTitle"),
	};
}

export default function Page({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const message = error.digest ? `digest: ${error.digest}` : error.message;
	const loadingBar = useContext(LoadingBarContext);
	const { modelView: errorPageModelView, interact: errorPageInteract } =
		useInitializedStatefulInteractiveModel(
			errorPageVIInterface(reset, loadingBar),
			{ message },
		);

	useEffect(() => {
		if (message != errorPageModelView.message)
			errorPageInteract({ type: "REPORT_ERROR", input: { message } });
	}, [errorPageInteract, errorPageModelView.message, message]);

	useLayoutEffect(() => {
		return () => {
			// HACK
			setTimeout(
				() =>
					loadingBar.interact({
						type: "SET_LOADING",
						input: { value: false },
					}),
				1000,
			);
		};
	}, [loadingBar]);

	return (
		<ErrorPage
			model={{
				modelView: errorPageModelView,
				interact: errorPageInteract,
			}}
		/>
	);
}
