"use client";

import Button from "@/src/lib/components/button/Button";
import AutoCompleteBox from "@/src/lib/components/auto-complete-box/AutoCompleteBox";
import QuotePreviewModal from "@/src/lib/components/quote-preview-modal/QuotePreviewModal";
import Spinner from "@/src/lib/components/spinner/Spinner";
import Tabs from "@/src/lib/components/tabs/Tabs";
import { useAutoCompleteBox } from "@/src/lib/model-implementations/auto-complete-box";
import { useQuotePreviewModal } from "@/src/lib/model-implementations/quote-preview-model";
import { useTabs } from "@/src/lib/model-implementations/tabs";
import { NewQuoteModel } from "@/src/lib/models/new-quote";
import { georgia } from "@/src/lib/third-party/fonts";
import { getDateString } from "@/src/lib/utilities/date-time";
import { getDefaultValues } from "@/src/lib/utilities/quote-form";
import { useQuoteFormSchema } from "@/src/lib/validation/quote-form";
import { Checkbox, Field, Label } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import { useCallback } from "react";

const NewQuote = function ({ model }) {
	const { modelView, interact } = model;
	const { newQuoteNotification, autoCompleteInfo } = modelView;
	const t = useTranslations("newQuote");
	const quoteFormSchema = useQuoteFormSchema();
	const defaultValues = getDefaultValues();
	const currentDate = getDateString(new Date(), true);
	const {
		control,
		register,
		handleSubmit,
		getValues,
		setValue,
		watch,
		reset,
		formState: { isSubmitting, errors, isValid },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(quoteFormSchema),
		shouldUnregister: true,
		defaultValues: {
			...defaultValues,
			scheduledDate: getDateString(defaultValues.scheduledDate, true),
		},
	});
	const isQuoteScheduled = watch("isQuoteScheduled");

	const tabs = useTabs([
		newReadonlyModel({ name: t("english") }),
		newReadonlyModel({ name: t("russian") }),
	]);
	const quotePreviewModal = useQuotePreviewModal();
	const englishAuthorAutoCompleteBox = useAutoCompleteBox({
		id: "english-author",
		isOpen: false,
		items:
			autoCompleteInfo?.existingAuthors.map(author => author.english) ??
			[],
		query: "",
		selectCallback: value => {
			setValue("authorEn", value);
			setValue(
				// TODO: Refactor
				"authorRu",
				autoCompleteInfo!.existingAuthors.filter(
					author => author.english == value,
				)[0].russian ?? "",
			);
		},
	});
	const russianAuthorAutoCompleteBox = useAutoCompleteBox({
		id: "russian-author",
		isOpen: false,
		items:
			autoCompleteInfo?.existingAuthors
				.map(author => author.russian)
				.filter(russianName => russianName !== null) ?? [],
		query: "",
		selectCallback: value => {
			setValue("authorRu", value);
			setValue(
				"authorEn",
				autoCompleteInfo!.existingAuthors.filter(
					author => author.russian == value,
				)[0].english,
			);
		},
	});
	const englishSourceAutoCompleteBox = useAutoCompleteBox({
		id: "english-source",
		isOpen: false,
		items:
			autoCompleteInfo?.existingSources.map(source => source.english) ??
			[],
		query: "",
		selectCallback: value => {
			setValue("sourceEn", value);
			setValue(
				"sourceRu",
				autoCompleteInfo!.existingSources.filter(
					source => source.english == value,
				)[0].russian ?? "",
			);
		},
	});
	const russianSourceAutoCompleteBox = useAutoCompleteBox({
		id: "russian-source",
		isOpen: false,
		items:
			autoCompleteInfo?.existingSources
				.map(source => source.russian)
				.filter(russianName => russianName !== null) ?? [],
		query: "",
		selectCallback: value => {
			setValue("sourceRu", value);
			setValue(
				"sourceEn",
				autoCompleteInfo!.existingSources.filter(
					source => source.russian == value,
				)[0].english,
			);
		},
	});
	const hasFormChanged = () =>
		!(
			defaultValues.authorEn === watch("authorEn") &&
			defaultValues.authorRu === watch("authorRu") &&
			defaultValues.sourceEn === watch("sourceEn") &&
			defaultValues.sourceRu === watch("sourceRu") &&
			defaultValues.quoteEn === watch("quoteEn") &&
			defaultValues.quoteRu === watch("quoteRu")
		);

	useCloseWarning(hasFormChanged);

	return (
		<>
			{quotePreviewModal.modelView && (
				<QuotePreviewModal
					model={{
						...quotePreviewModal,
						modelView: quotePreviewModal.modelView,
					}}
				/>
			)}
			{autoCompleteInfo && (
				<>
					<AutoCompleteBox model={englishAuthorAutoCompleteBox} />
					<AutoCompleteBox model={russianAuthorAutoCompleteBox} />
					<AutoCompleteBox model={englishSourceAutoCompleteBox} />
					<AutoCompleteBox model={russianSourceAutoCompleteBox} />
				</>
			)}
			<main className="new-quote border-t-15 border-t-[#976029] bg-[#FEF8F3] text-black">
				<div className="new-quote-content flex flex-col gap-6 p-8 py-9 md:py-10 lg:px-20">
					<span
						className={`mb-2 text-[2.75rem]/tight font-semibold md:text-black ${georgia.className}`}
					>
						{t("title")}
						<hr className="mt-4 mb-0 md:w-full" />
					</span>
					<form
						onSubmit={handleSubmit(
							async form => {
								const {
									authorEn,
									quoteEn,
									sourceEn,
									authorRu,
									quoteRu,
									sourceRu,
									scheduledDate,
								} = form;
								await interact({
									type: "ADD_QUOTE",
									input: {
										newQuote: {
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
											scheduledDate:
												scheduledDate === undefined //TODO: Revisit
													? undefined
													: (getValues(
															"scheduledDate",
														) as string),
										},
										options: {
											successCallback: async () => {
												reset();
												await tabs.interact({
													type: "SWITCH_TAB",
													input: { id: 0 },
												});
											},
										},
									},
								});
							},
							async errors => {
								if (
									errors.authorEn ||
									errors.sourceEn ||
									errors.quoteEn
								)
									return await tabs.interact({
										type: "SWITCH_TAB",
										input: { id: 0 },
									});
								if (
									errors.authorRu ||
									errors.sourceRu ||
									errors.quoteRu
								)
									return await tabs.interact({
										type: "SWITCH_TAB",
										input: { id: 1 },
									});
							},
						)}
					>
						<div className="flex flex-col gap-6 md:w-3/4 lg:w-6/10">
							<Tabs model={tabs}>
								<div className="flex flex-col gap-3">
									<input
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.authorEn ? "border-red-800" : "border-gray-400"}`}
										placeholder={t("author")}
										id="quote-author"
										formNoValidate
										autoCapitalize="words"
										autoComplete="off"
										{...register("authorEn")}
										data-tooltip-id={
											englishAuthorAutoCompleteBox
												.modelView.id
										}
										onChange={async e => {
											register("authorEn").onChange(e);
											await englishAuthorAutoCompleteBox.interact(
												{
													type: "TOGGLE",
													input: {
														value:
															e.target.value.trim() ===
															""
																? "close"
																: "open",
													},
												},
											);
											await englishAuthorAutoCompleteBox.interact(
												{
													type: "FILTER",
													input: {
														query: e.target.value,
													},
												},
											);
										}}
										onBlur={() =>
											englishAuthorAutoCompleteBox.interact(
												{
													type: "TOGGLE",
													input: {
														value: "close",
													},
												},
											)
										}
									/>
									{errors.authorEn && (
										<span className="text-sm text-red-800">
											{errors.authorEn.message}
										</span>
									)}
									<input
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.sourceEn ? "border-red-800" : "border-gray-400"}`}
										placeholder={`${t("source")} (${t("optional")})`}
										id="quote-source"
										autoComplete="off"
										formNoValidate
										{...register("sourceEn")}
										data-tooltip-id={
											englishSourceAutoCompleteBox
												.modelView.id
										}
										onChange={async e => {
											register("sourceEn").onChange(e);
											await englishSourceAutoCompleteBox.interact(
												{
													type: "TOGGLE",
													input: {
														value:
															e.target.value.trim() ===
															""
																? "close"
																: "open",
													},
												},
											);
											await englishSourceAutoCompleteBox.interact(
												{
													type: "FILTER",
													input: {
														query: e.target.value,
													},
												},
											);
										}}
										onBlur={() =>
											englishSourceAutoCompleteBox.interact(
												{
													type: "TOGGLE",
													input: {
														value: "close",
													},
												},
											)
										}
									/>
									{errors.sourceEn && (
										<span className="text-sm text-red-800">
											{errors.sourceEn.message}
										</span>
									)}
									<textarea
										className={`w-full resize-none rounded-lg border bg-white p-4 ${errors.quoteEn ? "border-red-800" : "border-gray-400"}`}
										placeholder={t("quote")}
										rows={5}
										autoComplete="off"
										{...register("quoteEn")}
									/>
									{errors.quoteEn && (
										<span className="text-sm text-red-800">
											{errors.quoteEn.message}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-3">
									<input
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.authorRu ? "border-red-800" : "border-gray-400"}`}
										placeholder={`${t("author")} (${t("optional")})`}
										id="quote-author-ru"
										autoCapitalize="words"
										autoComplete="off"
										{...register("authorRu")}
										data-tooltip-id={
											russianAuthorAutoCompleteBox
												.modelView.id
										}
										onChange={async e => {
											register("authorRu").onChange(e);
											await russianAuthorAutoCompleteBox.interact(
												{
													type: "TOGGLE",
													input: {
														value:
															e.target.value.trim() ===
															""
																? "close"
																: "open",
													},
												},
											);
											await russianAuthorAutoCompleteBox.interact(
												{
													type: "FILTER",
													input: {
														query: e.target.value,
													},
												},
											);
										}}
										onBlur={() =>
											russianAuthorAutoCompleteBox.interact(
												{
													type: "TOGGLE",
													input: {
														value: "close",
													},
												},
											)
										}
									/>
									{errors.authorRu && (
										<span className="text-sm text-red-800">
											{errors.authorRu.message}
										</span>
									)}
									<input
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.sourceRu ? "border-red-800" : "border-gray-400"}`}
										placeholder={`${t("source")} (${t("optional")})`}
										id="quote-source-ru"
										autoComplete="off"
										{...register("sourceRu")}
										data-tooltip-id={
											russianSourceAutoCompleteBox
												.modelView.id
										}
										onChange={async e => {
											register("sourceRu").onChange(e);
											await russianSourceAutoCompleteBox.interact(
												{
													type: "TOGGLE",
													input: {
														value:
															e.target.value.trim() ===
															""
																? "close"
																: "open",
													},
												},
											);
											await russianSourceAutoCompleteBox.interact(
												{
													type: "FILTER",
													input: {
														query: e.target.value,
													},
												},
											);
										}}
										onBlur={() =>
											russianSourceAutoCompleteBox.interact(
												{
													type: "TOGGLE",
													input: {
														value: "close",
													},
												},
											)
										}
									/>
									{errors.sourceRu && (
										<span className="text-sm text-red-800">
											{errors.sourceRu.message}
										</span>
									)}
									<textarea
										className={`w-full resize-none rounded-lg border bg-white p-4 ${errors.quoteRu ? "border-red-800" : "border-gray-400"}`}
										placeholder={`${t("quote")} (${t("optional")})`}
										rows={5}
										id="quote-ru"
										autoComplete="off"
										{...register("quoteRu")}
									/>
									{errors.quoteRu && (
										<span className="text-sm text-red-800">
											{errors.quoteRu.message}
										</span>
									)}
								</div>
							</Tabs>
							<div className="flex flex-col gap-3">
								<Field className="flex items-center gap-3">
									<Controller
										control={control}
										name={"isQuoteScheduled"}
										render={({
											field: { onChange, value },
										}) => (
											<Checkbox
												className={`group flex size-6 items-center justify-center rounded border border-gray-400 bg-white data-checked:bg-gray-900`}
												onChange={onChange}
												checked={value}
											>
												<Check
													className={
														"hidden size-4 stroke-white group-data-checked:block"
													}
												/>
											</Checkbox>
										)}
									/>
									<Label>{t("schedulerCheckLabel")}</Label>
								</Field>
								{isQuoteScheduled && (
									<>
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.scheduledDate ? "border-red-800" : "border-gray-400"}`}
											type="date"
											id="scheduled-date"
											formNoValidate
											min={currentDate}
											{...register("scheduledDate")}
										/>
										{errors.scheduledDate && (
											<span className="text-sm text-red-800">
												{errors.scheduledDate.message}
											</span>
										)}
									</>
								)}
							</div>
							{errors.form && (
								<span className="text-sm text-red-800">
									{errors.form.message}
								</span>
							)}
							<hr className="mt-1 w-full" />
							<div className="mt-1 flex w-full justify-start gap-3">
								<Button
									model={newReadonlyModel({
										type: "button",
										disabled: !isValid,
										className:
											"w-fit max-w-1/2 min-w-[8em]",
										action: handleSubmit(async form => {
											const {
												authorEn,
												quoteEn,
												sourceEn,
												authorRu,
												quoteRu,
												sourceRu,
											} = form;
											await quotePreviewModal.interact({
												type: "OPEN",
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
												},
											});
										}),
									})}
								>
									{t("preview")}
								</Button>
								<Button
									model={newReadonlyModel({
										type: "submit",
										variant: "standard",
										disabled:
											isSubmitting ||
											newQuoteNotification?.type ===
												"pending",
										className:
											"w-fit flex items-center justify-center max-w-1/2 min-w-[8em]",
									})}
								>
									{newQuoteNotification?.type ===
									"pending" ? (
										<Spinner
											model={newReadonlyModel({
												color: "white",
												size: 20,
											})}
										/>
									) : (
										t("addQuote")
									)}
								</Button>
							</div>
						</div>
					</form>
				</div>
			</main>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<NewQuoteModel>>;

export default NewQuote;
