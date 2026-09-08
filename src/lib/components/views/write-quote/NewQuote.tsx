"use client";

import AutoCompleteBox from "@/src/lib/components/auto-complete-box/AutoCompleteBox";
import Button from "@/src/lib/components/button/Button";
import Checkbox from "@/src/lib/components/checkbox/Checkbox";
import PageView from "@/src/lib/components/page-view/PageView";
import QuotePreviewModal from "@/src/lib/components/quote-preview-modal/QuotePreviewModal";
import Spinner from "@/src/lib/components/spinner/Spinner";
import Tabs from "@/src/lib/components/tabs/Tabs";
import { useAutoCompleteBox } from "@/src/lib/model-implementations/auto-complete-box";
import { useQuotePreviewModal } from "@/src/lib/model-implementations/quote-preview-model";
import { useTabs } from "@/src/lib/model-implementations/tabs";
import { NewQuoteModel } from "@/src/lib/models/new-quote";
import { Translation } from "@/src/lib/types/general";
import { getDateString } from "@/src/lib/utilities/date-time";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import { getDefaultValues } from "@/src/lib/utilities/quote-form";
import { useQuoteFormSchema } from "@/src/lib/validation/quote-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

type CompleteTranslation = {
	[P in keyof Translation]: NonNullable<Translation[P]>;
};

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
	const englishAuthorAutoCompleteBox = useAutoCompleteBox(
		{
			id: "english-author",
			isOpen: false,
			items: autoCompleteInfo?.existingAuthors ?? [],
			query: "",
			transformer: item => item.english,
		},
		item => {
			setValue("authorEn", item.english);
			setValue("authorRu", item.russian ?? "");
		},
	);
	const russianAuthorAutoCompleteBox = useAutoCompleteBox(
		{
			id: "russian-author",
			isOpen: false,
			items: (autoCompleteInfo?.existingAuthors.filter(
				author => author.russian !== null,
			) ?? []) as CompleteTranslation[],
			query: "",
			transformer: item => item.russian,
		},
		item => {
			setValue("authorRu", item.russian);
			setValue("authorEn", item.english);
		},
	);
	const englishSourceAutoCompleteBox = useAutoCompleteBox(
		{
			id: "english-source",
			isOpen: false,
			items: autoCompleteInfo?.existingSources ?? [],
			query: "",
			transformer: item => item.english,
		},
		item => {
			setValue("sourceEn", item.english);
			setValue("sourceRu", item.russian ?? "");
		},
	);
	const russianSourceAutoCompleteBox = useAutoCompleteBox(
		{
			id: "russian-source",
			isOpen: false,
			items: (autoCompleteInfo?.existingSources.filter(
				source => source.russian !== null,
			) ?? []) as CompleteTranslation[],
			query: "",
			transformer: item => item.russian,
		},
		item => {
			setValue("sourceRu", item.russian);
			setValue("sourceEn", item.english);
		},
	);
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
			<QuotePreviewModal model={quotePreviewModal} />
			{autoCompleteInfo && (
				<>
					<AutoCompleteBox model={englishAuthorAutoCompleteBox} />
					<AutoCompleteBox model={russianAuthorAutoCompleteBox} />
					<AutoCompleteBox model={englishSourceAutoCompleteBox} />
					<AutoCompleteBox model={russianSourceAutoCompleteBox} />
				</>
			)}
			<PageView
				model={newReadonlyModel({
					title: t("title"),
					topBarColor: "#976029",
				})}
			>
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
								<Controller
									control={control}
									name={"authorEn"}
									render={({
										field: {
											name,
											onChange,
											onBlur,
											value,
										},
									}) => (
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.authorEn ? "border-red-800" : "border-gray-400"}`}
											placeholder={t("author")}
											name={name}
											value={value}
											formNoValidate
											autoCapitalize="words"
											autoComplete="off"
											data-tooltip-id={
												englishAuthorAutoCompleteBox
													.modelView.id
											}
											onChange={async e => {
												onChange(e);
												await englishAuthorAutoCompleteBox.interact(
													{
														type: "TOGGLE",
														input: {
															value: !(
																e.target.value.trim() ===
																""
															),
														},
													},
												);
												await englishAuthorAutoCompleteBox.interact(
													{
														type: "FILTER",
														input: {
															query: e.target
																.value,
														},
													},
												);
											}}
											onBlur={() => {
												onBlur();
												englishAuthorAutoCompleteBox.interact(
													{
														type: "TOGGLE",
														input: {
															value: false,
														},
													},
												);
											}}
										/>
									)}
								/>
								{errors.authorEn && (
									<span className="text-sm text-red-800">
										{errors.authorEn.message}
									</span>
								)}
								<Controller
									control={control}
									name={"sourceEn"}
									render={({
										field: {
											name,
											onChange,
											onBlur,
											value,
										},
									}) => (
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.sourceEn ? "border-red-800" : "border-gray-400"}`}
											placeholder={`${t("source")} (${t("optional")})`}
											autoComplete="off"
											name={name}
											value={
												typeof value === "string"
													? value
													: ""
											}
											formNoValidate
											data-tooltip-id={
												englishSourceAutoCompleteBox
													.modelView.id
											}
											onChange={async e => {
												onChange(e);
												await englishSourceAutoCompleteBox.interact(
													{
														type: "TOGGLE",
														input: {
															value: !(
																e.target.value.trim() ===
																""
															),
														},
													},
												);
												await englishSourceAutoCompleteBox.interact(
													{
														type: "FILTER",
														input: {
															query: e.target
																.value,
														},
													},
												);
											}}
											onBlur={() => {
												onBlur();
												englishSourceAutoCompleteBox.interact(
													{
														type: "TOGGLE",
														input: {
															value: false,
														},
													},
												);
											}}
										/>
									)}
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
								<Controller
									control={control}
									name={"authorRu"}
									render={({
										field: {
											name,
											onChange,
											onBlur,
											value,
										},
									}) => (
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.authorRu ? "border-red-800" : "border-gray-400"}`}
											placeholder={`${t("author")} (${t("optional")})`}
											name={name}
											value={
												typeof value === "string"
													? value
													: ""
											}
											autoCapitalize="words"
											autoComplete="off"
											data-tooltip-id={
												russianAuthorAutoCompleteBox
													.modelView.id
											}
											onChange={async e => {
												onChange(e);
												await russianAuthorAutoCompleteBox.interact(
													{
														type: "TOGGLE",
														input: {
															value: !(
																e.target.value.trim() ===
																""
															),
														},
													},
												);
												await russianAuthorAutoCompleteBox.interact(
													{
														type: "FILTER",
														input: {
															query: e.target
																.value,
														},
													},
												);
											}}
											onBlur={() => {
												onBlur();
												russianAuthorAutoCompleteBox.interact(
													{
														type: "TOGGLE",
														input: {
															value: false,
														},
													},
												);
											}}
										/>
									)}
								/>
								{errors.authorRu && (
									<span className="text-sm text-red-800">
										{errors.authorRu.message}
									</span>
								)}
								<Controller
									control={control}
									name={"sourceRu"}
									render={({
										field: {
											name,
											onChange,
											onBlur,
											value,
										},
									}) => (
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.sourceRu ? "border-red-800" : "border-gray-400"}`}
											placeholder={`${t("source")} (${t("optional")})`}
											name={name}
											value={
												typeof value === "string"
													? value
													: ""
											}
											autoComplete="off"
											data-tooltip-id={
												russianSourceAutoCompleteBox
													.modelView.id
											}
											onChange={async e => {
												onChange(e);
												await russianSourceAutoCompleteBox.interact(
													{
														type: "TOGGLE",
														input: {
															value: !(
																e.target.value.trim() ===
																""
															),
														},
													},
												);
												await russianSourceAutoCompleteBox.interact(
													{
														type: "FILTER",
														input: {
															query: e.target
																.value,
														},
													},
												);
											}}
											onBlur={() => {
												onBlur();
												russianSourceAutoCompleteBox.interact(
													{
														type: "TOGGLE",
														input: {
															value: false,
														},
													},
												);
											}}
										/>
									)}
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
							<Controller
								control={control}
								name={"isQuoteScheduled"}
								render={({ field: { onChange, value } }) => (
									<Checkbox
										model={newReadonlyModel({
											isChecked: value,
											label: t("schedulerCheckLabel"),
											checkedChangeCallback: onChange,
										})}
									/>
								)}
							/>
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
									className: "w-fit max-w-1/2 min-w-[8em]",
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
							</Button>
						</div>
					</div>
				</form>
			</PageView>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<NewQuoteModel>>;

export default NewQuote;
