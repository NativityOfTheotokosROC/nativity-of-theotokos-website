"use client";

import { createToast } from "@/src/lib/components/miscellaneous/utility";
import Spinner from "@/src/lib/components/spinner/Spinner";
import { NewQuoteModel } from "@/src/lib/models/new-quote";
import { georgia } from "@/src/lib/third-party/fonts";
import { getDateString } from "@/src/lib/utilities/date-time";
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
import { useEffect, ViewTransition } from "react";
import { useForm } from "react-hook-form";

const NewQuote = function ({ model }) {
	const quoteFormSchema = useQuoteFormSchema();
	const currentDate = getDateString(new Date(), true);
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
			isQuoteScheduled: false,
			scheduledDate: currentDate,
		},
	});
	const isQuoteScheduled = watch("isQuoteScheduled");

	useEffect(() => {
		if (newQuoteNotification?.type === "success") {
			createToast({
				type: "success",
				message: newQuoteNotification.text,
			});
		} else if (newQuoteNotification?.type === "failure") {
			createToast({
				type: "failure",
				message: newQuoteNotification.message,
			});
		}
	}, [newQuoteNotification]);

	return (
		<main className="new-quote border-t-15 border-t-[#976029] bg-[#FEF8F3] text-black">
			<div className="new-quote-content flex flex-col gap-6 p-8 py-9 md:py-10 lg:px-20">
				<span
					className={`mb-2 text-[2.75rem]/tight font-semibold md:text-black ${georgia.className}`}
				>
					{t("title")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<form
					onSubmit={handleSubmit(form => {
						const {
							authorEn,
							quoteEn,
							sourceEn,
							authorRu,
							quoteRu,
							sourceRu,
							scheduledDate,
						} = form;
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
					})}
				>
					<div className="flex flex-col gap-6 md:w-3/4 lg:w-6/10">
						<TabGroup className="flex flex-col gap-6">
							<TabList className="flex items-center gap-1">
								<Tab
									className="flex items-center border-b-5 border-gray-300 p-4 py-2 text-sm uppercase focus:outline-none data-hover:border-gray-600 data-selected:border-gray-900"
									as={"button"}
								>
									{t("english")}
								</Tab>
								<Tab
									className="flex items-center border-b-5 border-gray-300 p-4 py-2 text-sm uppercase focus:outline-none data-hover:border-gray-600 data-selected:border-gray-900"
									as={"button"}
								>
									{t("russian")}
								</Tab>
							</TabList>
							<TabPanels>
								{selectedIndex => (
									<ViewTransition
										key={`tab-${selectedIndex}`}
										name="tab-panels"
										share="auto"
										enter="auto"
										default="none"
									>
										<TabPanel
											className="flex flex-col gap-3"
											unmount={true}
										>
											<input
												className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.authorEn ? "border-red-700" : "border-gray-400"}`}
												placeholder={t("author")}
												id="quote-author"
												required
												autoCapitalize="words"
												autoComplete="on"
												{...register("authorEn")}
											/>
											{errors.authorEn && (
												<span className="text-sm text-red-700">
													{errors.authorEn.message}
												</span>
											)}
											<input
												className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.sourceEn ? "border-red-700" : "border-gray-400"}`}
												placeholder={`${t("source")} (${t("optional")})`}
												id="quote-source"
												autoComplete="on"
												{...register("sourceEn")}
											/>
											{errors.sourceEn && (
												<span className="text-sm text-red-700">
													{errors.sourceEn.message}
												</span>
											)}
											<textarea
												className={`w-full rounded-lg border bg-white p-4 ${errors.quoteEn ? "border-red-700" : "border-gray-400"}`}
												placeholder={t("quote")}
												rows={5}
												autoComplete="off"
												required
												{...register("quoteEn")}
											/>
											{errors.quoteEn && (
												<span className="text-sm text-red-700">
													{errors.quoteEn.message}
												</span>
											)}
										</TabPanel>
										<TabPanel
											className="flex flex-col gap-3"
											unmount={false}
										>
											<input
												className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.authorRu ? "border-red-700" : "border-gray-400"}`}
												placeholder={`${t("author")} (${t("optional")})`}
												id="quote-author-ru"
												autoCapitalize="words"
												autoComplete="on"
												{...register("authorRu")}
											/>
											{errors.authorRu && (
												<span className="text-sm text-red-700">
													{errors.authorRu.message}
												</span>
											)}
											<input
												className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.sourceRu ? "border-red-700" : "border-gray-400"}`}
												placeholder={`${t("source")} (${t("optional")})`}
												id="quote-source-ru"
												autoComplete="on"
												{...register("sourceRu")}
											/>
											{errors.sourceRu && (
												<span className="text-sm text-red-700">
													{errors.sourceRu.message}
												</span>
											)}
											<textarea
												className={`w-full rounded-lg border bg-white p-4 ${errors.quoteRu ? "border-red-700" : "border-gray-400"}`}
												placeholder={`${t("quote")} (${t("optional")})`}
												rows={5}
												id="quote-ru"
												autoComplete="off"
												{...register("quoteRu")}
											/>
											{errors.quoteRu && (
												<span className="text-sm text-red-700">
													{errors.quoteRu.message}
												</span>
											)}
										</TabPanel>
									</ViewTransition>
								)}
							</TabPanels>
						</TabGroup>
						<div className="flex flex-col gap-3">
							<Field className="flex items-center gap-3">
								<Checkbox
									{...register("isQuoteScheduled")}
									onChange={value => {
										setValue("isQuoteScheduled", value);
									}}
									className={`group flex size-6 items-center justify-center rounded border border-gray-400 bg-white data-checked:bg-gray-900`}
								>
									<Check
										className={
											"hidden size-4 stroke-white group-data-checked:block"
										}
									/>
								</Checkbox>
								<Label>{t("schedulerCheckLabel")}</Label>
							</Field>
							{isQuoteScheduled && (
								<>
									<input
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.scheduledDate ? "border-red-700" : "border-gray-400"}`}
										type="date"
										id="scheduled-date"
										required
										min={currentDate}
										{...register("scheduledDate")}
									/>
									{errors.scheduledDate && (
										<span className="text-sm text-red-700">
											{errors.scheduledDate.message}
										</span>
									)}
								</>
							)}
						</div>
						{errors.form && (
							<span className="text-sm text-red-700">
								{errors.form.message}
							</span>
						)}
						<hr className="mt-1 w-full" />
						<div className="mt-1 flex w-full justify-start gap-3">
							<button
								type="button"
								className="w-fit max-w-1/2 min-w-[8em] rounded-lg bg-[#513433] p-4 text-white hover:bg-[#250203]/90 active:bg-[#250203] disabled:bg-[#250203]/50"
								onClick={() => {}}
								disabled
							>
								{t("preview")}
							</button>
							<button
								type="submit"
								className="flex w-fit max-w-1/2 min-w-[8em] items-center justify-center rounded-lg bg-[#513433] p-4 text-white hover:bg-[#250203]/90 active:bg-[#250203] disabled:bg-[#250203]/50"
								disabled={
									isSubmitting ||
									newQuoteNotification?.type === "pending"
								}
							>
								{newQuoteNotification?.type === "pending" ? (
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
