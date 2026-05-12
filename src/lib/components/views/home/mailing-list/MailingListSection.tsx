import { MailingListSectionModel } from "@/src/lib/models/mailing-list-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import {
	InitializedModel,
	InteractiveModel,
	ModelInteraction,
	newReadonlyModel,
} from "@mvc-react/mvc";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "../../../page-loading-bar/PageLoadingBar";
import Spinner from "../../../spinner/Spinner";

const MailingListSection = function ({ model }) {
	const t = useTranslations("mailingList");
	const { modelView } = model;
	const { mailingListRepository } = modelView;
	const { mailingListStatus } = mailingListRepository.modelView;
	const consentPanel = useConsentPanel(true);

	return (
		<section className="mailing-list bg-gray-900 text-white">
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ ease: "easeOut" }}
				className="mailing-list-content flex min-h-[22em] flex-col gap-8 p-8 py-14 md:w-3/4 lg:w-6/10 lg:px-20"
			>
				<span
					className={`mb-2 w-3/4 text-[2.75rem]/tight font-semibold ${georgia.className} wrap-break-word hyphens-auto`}
				>
					{t("mailingListHeader")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				{mailingListStatus?.type != "subscribed" ? (
					<div className="flex flex-col gap-8">
						<p>{t("mailingListDescription")}</p>
						<form
							action={formData => {
								mailingListRepository.interact({
									type: "SUBSCRIBE",
									input: {
										email: formData
											.get("email")!
											.toString()
											.trim(),
									},
								});
							}}
						>
							<div className="flex h-[3.5em] flex-nowrap items-stretch overflow-clip rounded-lg text-black md:max-w-[32em]">
								<input
									className="w-full grow bg-[whitesmoke] p-4"
									type="email"
									placeholder="you@example.com"
									name="email"
									id="mailing-email"
									required
									autoComplete="email"
									onChange={() =>
										consentPanel.interact({
											type: "SHOW",
										})
									}
								/>
								<button
									className={`flex h-full w-[9em] min-w-fit items-center justify-center bg-gray-600 p-4 text-center text-white hover:bg-gray-700 active:bg-gray-950 disabled:bg-gray-400 md:w-[8em]`}
									type="submit"
									disabled={
										mailingListStatus?.type === "pending"
									}
								>
									{mailingListStatus?.type === "pending" ? (
										<Spinner
											model={newReadonlyModel({
												color: "white",
												size: 20,
											})}
										/>
									) : (
										t("mailingListButton")
									)}
								</button>
							</div>
						</form>
						{mailingListStatus?.type === "failed" && (
							<span className="text-xs text-red-400">
								{mailingListStatus.message}
							</span>
						)}
						<div
							className={`consent-message mt-8 flex flex-col gap-2 transition duration-200 md:max-w-md ${consentPanel.modelView.isShown ? "visible opacity-100" : "invisible opacity-0"}`}
						>
							<hr className="text-white/30" />
							<span className="text-sm">
								{t.rich("consent", {
									tos: text => (
										<Link
											className="underline hover:text-[#dcb042] active:text-[#dcb042]"
											href="/terms"
											target="_blank"
										>
											{text}
										</Link>
									),
									privacy: text => (
										<Link
											className="underline hover:text-[#dcb042] active:text-[#dcb042]"
											href="/privacy-policy"
											target="_blank"
										>
											{text}
										</Link>
									),
									privacyPolicy: t("privacyPolicy"),
									termsOfService: t("termsOfService"),
								})}
							</span>
						</div>
					</div>
				) : (
					<div>
						<p className="text-xl">{mailingListStatus.text}</p>
					</div>
				)}
			</motion.div>
		</section>
	);
} satisfies ModeledVoidComponent<InitializedModel<MailingListSectionModel>>;

type ConsentPanelModelView = {
	isShown: boolean;
};

type ConsentPanelModelInteraction = ModelInteraction<"SHOW">;

type ConsentPanelModel = InteractiveModel<
	ConsentPanelModelView,
	ConsentPanelModelInteraction
>;

function useConsentPanel(defaultShown?: boolean) {
	const [isShown, setShown] = useState(defaultShown ?? false);
	return {
		interact: function (
			interaction: ConsentPanelModelInteraction,
		): void | Promise<void> {
			switch (interaction.type) {
				case "SHOW": {
					if (!isShown) setShown(true);
					break;
				}
			}
		},
		modelView: {
			isShown,
		},
	} satisfies ConsentPanelModel;
}

export default MailingListSection;
