"use client";

import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ErrorPageModel } from "@/src/lib/models/error-page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ErrorGraphic from "@/public/assets/graphic-3.svg";
import { InitializedModel } from "@mvc-react/mvc";
import PageView from "../../page-view/PageView";

const Error = function ({ model }) {
	const { modelView, interact } = model;
	const { message } = modelView;
	const t = useTranslations("error");

	return (
		<PageView model={{ modelView: { topBarColor: "#460809" } }}>
			<ErrorGraphic className="h-54 w-64 md:h-48" opacity={0.9} />
			<span className={`text-4xl font-semibold ${georgia.className}`}>
				{t("title")}
			</span>
			<span className="text-lg [&_a]:underline [&_a:hover]:text-[#ffdc4f]">
				{`${t("description")}, `}
				<Link href="mailto:info@nativityoftheotokos.com">{`${t("contactUs")}.`}</Link>
			</span>
			<span className="text-xs">{message}</span>
			<button
				className="w-30 max-w-3/4 min-w-fit rounded-lg bg-[#250203]/82 p-4 text-white hover:bg-[#250203]/92 active:bg-[#250203]"
				onClick={() => {
					interact({ type: "RETRY" });
				}}
			>
				{t("tryAgain")}
			</button>
		</PageView>
	);
} satisfies ModeledVoidComponent<InitializedModel<ErrorPageModel>>;

export default Error;
