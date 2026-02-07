"use client";

import { newReadonlyModel } from "@mvc-react/mvc";
import ErrorPage from "./error-page/ErrorPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
	return (
		<ErrorPage
			model={newReadonlyModel({
				message: error.digest
					? `digest: ${error.digest}`
					: error.message,
				resetFunction: reset,
			})}
		/>
	);
}
