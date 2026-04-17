import { MailingListSectionModel } from "@/src/lib/models/mailing-list-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Spinner from "../../../spinner/Spinner";
import { newReadonlyModel } from "@mvc-react/mvc";

const MailingListSection = function ({ model }) {
	const t = useTranslations("mailingList");
	const { interact, modelView } = model.modelView.mailingListRepository;
	const { mailingListStatus } = modelView;

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
								interact({
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
								/>
								<button
									className={`flex h-full w-[9em] min-w-fit items-center justify-center bg-gray-600 p-4 text-center text-white hover:bg-gray-700 active:bg-gray-950 disabled:bg-gray-400 md:w-[8em]`}
									type="submit"
									disabled={
										mailingListStatus?.type == "pending"
									}
								>
									{mailingListStatus?.type == "pending" ? (
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
						{mailingListStatus?.type == "failed" && (
							<span className="text-xs text-red-400">
								{mailingListStatus.message}
							</span>
						)}
					</div>
				) : (
					<div>
						<p className="text-xl">{mailingListStatus.text}</p>
					</div>
				)}
			</motion.div>
		</section>
	);
} satisfies ModeledVoidComponent<MailingListSectionModel>;

export default MailingListSection;
