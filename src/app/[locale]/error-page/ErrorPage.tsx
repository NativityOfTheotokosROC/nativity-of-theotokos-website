"use client";

import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ErrorPageModel } from "@/src/lib/model/error-page";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CloudAlert } from "lucide-react";

const ErrorPage = function ({ model }) {
	const { message, resetFunction } = model.modelView;
	const t = useTranslations("error");

	return (
		<main className={`error bg-[#FEF8F3] text-black`}>
			<div className="error-content flex items-center justify-center text-center p-8 py-15 pb-20 grow h-max border-t-15 border-red-950/90">
				<div className="flex flex-col items-center justify-center gap-6 w-md">
					<CloudAlert
						className="h-54 w-64"
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
						<Link href="mailto:nativityoftheotokos@gmail.com">{`${t("contactUs")}.`}</Link>
					</span>
					<span className="text-xs">{message}</span>
					<button
						className="text-white rounded-lg bg-[#250203]/82 p-4 min-w-fit w-30 max-w-3/4 hover:bg-[#250203]/92 active:bg-[#250203]"
						onClick={() => {
							resetFunction();
						}}
					>
						{t("tryAgain")}
					</button>
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<ErrorPageModel>;

export default ErrorPage;
