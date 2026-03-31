import { createToast } from "@/src/lib/component/miscellaneous/utility";
import Spinner from "@/src/lib/component/spinner/Spinner";
import { NewQuoteModel } from "@/src/lib/model/new-quote";
import { georgia } from "@/src/lib/third-party/fonts";
import { getDatePickerDate } from "@/src/lib/utility/date-time";
import { useQuoteFormSchema } from "@/src/lib/validation/quote-form";
import {
	Checkbox,
	Field,
	Label,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
} from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const NewQuote = function ({ model }) {
	const quoteFormSchema = useQuoteFormSchema();
	const currentDate = getDatePickerDate(new Date(), true);
	const t = useTranslations("newQuote");
	const { modelView, interact } = model;
	const { newQuoteNotification } = modelView;

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		setValue,
		watch,
	} = useForm({
		mode: "onBlur",
		resolver: zodResolver(quoteFormSchema),
		shouldUnregister: true,
		defaultValues: {
			scheduledDate: currentDate,
		},
	});

	const isQuoteScheduled = watch("isQuoteScheduled");
	useEffect(() => {
		if (newQuoteNotification?.type == "success") {
			createToast({
				type: "success",
				message: newQuoteNotification.text,
			});
		} else if (newQuoteNotification?.type == "failure") {
			createToast({
				type: "failure",
				message: newQuoteNotification.message,
			});
		}
	}, [newQuoteNotification]);

	return (
		<main className="new-quote bg-[#FEF8F3] text-black border-t-15 border-t-[#976029]">
			<div className="new-quote-content flex flex-col gap-6 p-8 py-9 lg:px-20 md:py-10">
				<span
					className={`text-[2.75rem]/tight mb-2 font-semibold md:text-black ${georgia.className}`}
				>
					{t("title")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<form
					onSubmit={handleSubmit(
						({
							authorEn,
							quoteEn,
							sourceEn,
							authorRu,
							quoteRu,
							sourceRu,
							scheduledDate,
						}) => {
							return interact({
								type: "ADD_QUOTE",
								input: {
									englishQuote: {
										author: authorEn,
										quote: quoteEn,
										source: sourceEn,
									},
									russianQuote: {
										author: authorRu,
										quote: quoteRu,
										source: sourceRu,
									},
									scheduledDate,
								},
							});
						},
					)}
				>
					<div className="flex flex-col md:w-3/4 lg:w-6/10 gap-6">
						<TabGroup className="flex flex-col gap-6">
							<TabList className="flex gap-1 items-center">
								<Tab
									className="flex items-center p-4 py-2 text-sm uppercase border-b-5 border-gray-300 data-selected:border-gray-900 data-hover:border-gray-600 focus:outline-none"
									as={"button"}
								>
									{t("english")}
								</Tab>
								<Tab
									className="flex items-center p-4 py-2 text-sm uppercase border-b-5 border-gray-300 data-selected:border-gray-900 data-hover:border-gray-600 focus:outline-none"
									as={"button"}
								>
									{t("russian")}
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel
									className="flex flex-col gap-3"
									unmount={false}
								>
									<input
										className={`p-4 bg-white w-full rounded-lg overflow-clip border ${errors.authorEn ? "border-red-700" : "border-gray-400"}`}
										placeholder={t("author")}
										id="quote-author"
										required
										autoCapitalize="words"
										autoComplete="on"
										{...register("authorEn")}
									/>
									{errors.authorEn && (
										<span className="text-red-700 text-sm">
											{errors.authorEn.message}
										</span>
									)}
									<input
										className={`p-4 bg-white w-full rounded-lg overflow-clip border ${errors.sourceEn ? "border-red-700" : "border-gray-400"}`}
										placeholder={`${t("source")} (${t("optional")})`}
										id="quote-source"
										autoComplete="on"
										{...register("sourceEn")}
									/>
									{errors.sourceEn && (
										<span className="text-red-700 text-sm">
											{errors.sourceEn.message}
										</span>
									)}
									<textarea
										className={`p-4 bg-white w-full rounded-lg border ${errors.quoteEn ? "border-red-700" : "border-gray-400"}`}
										placeholder={t("quote")}
										rows={5}
										autoComplete="off"
										required
										{...register("quoteEn")}
									/>
									{errors.quoteEn && (
										<span className="text-red-700 text-sm">
											{errors.quoteEn.message}
										</span>
									)}
								</TabPanel>
								<TabPanel
									className="flex flex-col gap-3"
									unmount={false}
								>
									<input
										className={`p-4 bg-white w-full rounded-lg overflow-clip border ${errors.authorRu ? "border-red-700" : "border-gray-400"}`}
										placeholder={`${t("author")} (${t("optional")})`}
										id="quote-author-ru"
										autoCapitalize="words"
										autoComplete="on"
										{...register("authorRu")}
									/>
									{errors.authorRu && (
										<span className="text-red-700 text-sm">
											{errors.authorRu.message}
										</span>
									)}
									<input
										className={`p-4 bg-white w-full rounded-lg overflow-clip border ${errors.sourceRu ? "border-red-700" : "border-gray-400"}`}
										placeholder={`${t("source")} (${t("optional")})`}
										id="quote-source-ru"
										autoComplete="on"
										{...register("sourceRu")}
									/>
									{errors.sourceRu && (
										<span className="text-red-700 text-sm">
											{errors.sourceRu.message}
										</span>
									)}
									<textarea
										className={`p-4 bg-white w-full rounded-lg border ${errors.quoteRu ? "border-red-700" : "border-gray-400"}`}
										placeholder={`${t("quote")} (${t("optional")})`}
										rows={5}
										id="quote-ru"
										autoComplete="off"
										{...register("quoteRu")}
									/>
									{errors.quoteRu && (
										<span className="text-red-700 text-sm">
											{errors.quoteRu.message}
										</span>
									)}
								</TabPanel>
							</TabPanels>
						</TabGroup>
						<div className="flex flex-col gap-3">
							<Field className="flex items-center gap-3">
								<Checkbox
									onChange={value => {
										setValue("isQuoteScheduled", value);
									}}
									className={`group flex justify-center items-center size-6 rounded bg-white data-checked:bg-gray-900 border border-gray-400`}
								>
									<Check
										className={
											"size-4 hidden stroke-white group-data-checked:block"
										}
									/>
								</Checkbox>
								<Label>{t("schedulerCheckLabel")}</Label>
							</Field>
							{isQuoteScheduled && (
								<input
									className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
									type="date"
									id="scheduled-date"
									required
									min={currentDate}
									{...register("scheduledDate")}
								/>
							)}
						</div>
						{errors.form && (
							<span className="text-red-700 text-sm">
								{errors.form.message}
							</span>
						)}
						<hr className="w-full mt-1" />
						<div className="flex mt-1 gap-3 justify-start w-full">
							<button
								type="button"
								className="bg-[#513433] text-white p-4 min-w-[8em] w-fit max-w-1/2 rounded-lg hover:bg-[#250203]/90 active:bg-[#250203] disabled:bg-[#250203]/50"
								onClick={() => {}}
								disabled
							>
								{t("preview")}
							</button>
							<button
								type="submit"
								className="flex justify-center items-center bg-[#513433] text-white p-4 min-w-[8em] w-fit max-w-1/2 rounded-lg hover:bg-[#250203]/90 active:bg-[#250203] disabled:bg-[#250203]/50"
								disabled={
									isSubmitting ||
									newQuoteNotification?.type == "pending"
								}
							>
								{newQuoteNotification?.type == "pending" ? (
									<Spinner
										model={newReadonlyModel({
											color: "white",
											size: 20,
										})}
									/>
								) : (
									t("addQuote")
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<NewQuoteModel>>;

export default NewQuote;
