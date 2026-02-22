import { MailingListSectionModel } from "@/src/lib/model/mailing-list-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const MailingListSection = function ({ model }) {
	const t = useTranslations("home");
	const { interact, modelView } = model.modelView.mailingListRepository;
	const { mailingListStatus } = modelView;

	return (
		<section className="mailing-list bg-gray-900 text-white">
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ ease: "easeOut" }}
				className="mailing-list-content flex flex-col gap-8 p-8 py-14 md:w-3/4 lg:w-6/10 lg:px-20"
			>
				<span
					className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold ${georgia.className} wrap-break-word hyphens-auto`}
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
							// onSubmit={() => {
							// 	setMailingListStatus("pending");
							// }}
						>
							<div className="flex flex-nowrap items-stretch text-black rounded-lg overflow-clip md:max-w-[32em]">
								<input
									className="grow p-4 bg-[whitesmoke] w-full"
									type="email"
									placeholder="you@example.com"
									name="email"
									id="mailing-email"
									required
									autoComplete="email"
								/>
								<button
									className={`p-4 min-w-fit w-fit h-full md:w-[8em] bg-gray-600 text-white text-center disabled:bg-gray-400 hover:bg-gray-700 active:bg-gray-950`}
									type="submit"
									disabled={
										mailingListStatus?.type == "pending"
									}
								>
									{t("mailingListButton")}
								</button>
							</div>
						</form>
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
