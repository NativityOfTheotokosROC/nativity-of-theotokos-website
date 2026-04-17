"use client";

import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ErrorPageModel } from "@/src/lib/models/error-page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CloudAlert } from "lucide-react";
import { InitializedModel } from "@mvc-react/mvc";

const Error = function ({ model }) {
	const { modelView, interact } = model;
	const { message } = modelView;
	const t = useTranslations("error");

	return (
		<main className={`error bg-[#FEF8F3] text-black`}>
			<div className="error-content flex h-full min-h-[94svh] grow justify-center border-t-15 border-red-950/90 p-8 py-15 pb-20 text-center">
				<div className="flex h-[70svh] min-h-fit w-md flex-col items-center justify-center gap-6">
					<CloudAlert
						className="h-54 w-64 md:h-48"
						opacity={0.9}
						strokeWidth={0.7}
					/>
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{t("title")}
					</span>
					<span className="text-lg [&_a]:underline [&_a:hover]:text-[#dcb042]">
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
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<ErrorPageModel>>;

export default Error;
