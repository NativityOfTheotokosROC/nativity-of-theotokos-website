"use client";

import { ForbiddenGraphic } from "@/src/lib/component/miscellaneous/graphic";
import { ForbiddenModel } from "@/src/lib/model/forbidden";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { useLayoutEffect } from "react";
import Spinner from "../../spinner/Spinner";

const Forbidden = function ({ model }) {
	const { modelView, interact } = model;
	const { signOutStatus } = modelView;
	const t = useTranslations("unauthorized");

	useLayoutEffect(() => {
		window.history.scrollRestoration = "manual";
		window.scrollTo(0, 0);
	}, []);

	return (
		<main className={`forbidden bg-[#FEF8F3] text-black`}>
			<div className="forbidden-content flex items-center justify-center text-center p-8 py-15 pb-20 grow min-h-max h-full border-t-15 border-[#832C0B]/90">
				<div className="flex flex-col items-center justify-center gap-6 w-md">
					<ForbiddenGraphic
						className="h-72 md:h-60 w-80"
						opacity={0.9}
						fill="#000"
					/>
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{t("title")}
					</span>
					<span className="text-lg">{t("description")}</span>
					<div className="flex gap-4">
						<button
							className="text-white rounded-lg bg-[#250203]/82 p-4 w-30 hover:bg-[#250203]/92 active:bg-[#250203] disabled:opacity-72"
							onClick={() => {
								interact({ type: "GO_HOME" });
							}}
						>
							{t("goHome")}
						</button>
						<button
							className="flex justify-center items-center text-white rounded-lg bg-[#250203]/82 p-4 w-30 hover:bg-[#250203]/92 active:bg-[#250203] disabled:opacity-72"
							onClick={() => {
								interact({ type: "SIGN_OUT" });
							}}
							disabled={
								signOutStatus?.type == "pending" ||
								signOutStatus?.type == "success"
							}
						>
							{signOutStatus?.type == "pending" ? (
								<Spinner
									model={newReadonlyModel({
										color: "white",
										size: 20,
									})}
								/>
							) : (
								t("signOut")
							)}
						</button>
					</div>
					{signOutStatus?.type == "failed" && (
						<span className="text-sm line-clamp-3 text-red-900">
							{signOutStatus.message}
						</span>
					)}
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<ForbiddenModel>>;

export default Forbidden;
