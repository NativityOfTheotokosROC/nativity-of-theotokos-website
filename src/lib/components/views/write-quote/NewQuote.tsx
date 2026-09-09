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
import { CompleteTranslation } from "@/src/lib/types/general";
import { getDateString } from "@/src/lib/utilities/date-time";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import { getDefaultValues } from "@/src/lib/utilities/quote-form";
import { useQuoteFormSchema } from "@/src/lib/validation/quote-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

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
		defaultValues,
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
			items: autoCompleteInfo?.existingAuthors ?? [],
			transformer: author => author.english,
		},
		author => {
			setValue("author", author);
		},
	);
	const russianAuthorAutoCompleteBox = useAutoCompleteBox(
		{
			id: "russian-author",
			items: (autoCompleteInfo?.existingAuthors.filter(
				author => author.russian !== null,
			) ?? []) as CompleteTranslation[],
			transformer: author => author.russian,
		},
		author => {
			setValue("author", author);
		},
	);
	const englishSourceAutoCompleteBox = useAutoCompleteBox(
		{
			id: "english-source",
			items: autoCompleteInfo?.existingSources ?? [],
			transformer: source => source.english,
		},
		source => {
			setValue("source", source);
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
			transformer: source => source.russian,
		},
		source => {
			setValue("source", source);
		},
	);
	const hasFormChanged = () =>
		!(
			defaultValues.author.english === getValues("author.english") &&
			defaultValues.author.russian === getValues("author.russian") &&
			defaultValues.source.english === getValues("source.english") &&
			defaultValues.source.russian === getValues("source.russian") &&
			defaultValues.quote.english === getValues("quote.english") &&
			defaultValues.quote.russian === getValues("quote.russian")
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
							await interact({
								type: "ADD_QUOTE",
								input: {
									newQuote: form,
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
								errors.author?.english ||
								errors.source?.english ||
								errors.quote?.english
							)
								return await tabs.interact({
									type: "SWITCH_TAB",
									input: { id: 0 },
								});
							if (
								errors.author?.russian ||
								errors.source?.russian ||
								errors.quote?.russian
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
									name={"author.english"}
									render={({
										field: {
											name,
											onChange,
											onBlur,
											value,
										},
									}) => (
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.author?.english ? "border-red-800" : "border-gray-400"}`}
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
								{errors.author?.english && (
									<span className="text-sm text-red-800">
										{errors.author.english.message}
									</span>
								)}
								<Controller
									control={control}
									name={"source.english"}
									render={({
										field: {
											name,
											onChange,
											onBlur,
											value,
										},
									}) => (
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.source?.english ? "border-red-800" : "border-gray-400"}`}
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
								{errors.source?.english && (
									<span className="text-sm text-red-800">
										{errors.source.english.message}
									</span>
								)}
								<textarea
									className={`w-full resize-none rounded-lg border bg-white p-4 ${errors.quote?.english ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("quote")}
									rows={5}
									autoComplete="off"
									{...register("quote.english")}
								/>
								{errors.quote?.english && (
									<span className="text-sm text-red-800">
										{errors.quote.english.message}
									</span>
								)}
							</div>
							<div className="flex flex-col gap-3">
								<Controller
									control={control}
									name={"author.russian"}
									render={({
										field: {
											name,
											onChange,
											onBlur,
											value,
										},
									}) => (
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.author?.russian ? "border-red-800" : "border-gray-400"}`}
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
								{errors.author?.russian && (
									<span className="text-sm text-red-800">
										{errors.author.russian.message}
									</span>
								)}
								<Controller
									control={control}
									name={"source.russian"}
									render={({
										field: {
											name,
											onChange,
											onBlur,
											value,
										},
									}) => (
										<input
											className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.source?.russian ? "border-red-800" : "border-gray-400"}`}
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
								{errors.source?.russian && (
									<span className="text-sm text-red-800">
										{errors.source.russian.message}
									</span>
								)}
								<textarea
									className={`w-full resize-none rounded-lg border bg-white p-4 ${errors.quote?.russian ? "border-red-800" : "border-gray-400"}`}
									placeholder={`${t("quote")} (${t("optional")})`}
									rows={5}
									autoComplete="off"
									{...register("quote.russian")}
								/>
								{errors.quote?.russian && (
									<span className="text-sm text-red-800">
										{errors.quote.russian.message}
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
										const { author, quote, source } = form;
										await quotePreviewModal.interact({
											type: "OPEN",
											input: {
												englishQuote: {
													author: author.english,
													quote: quote.english,
													source: source.english,
												},
												russianQuote: {
													author: author.russian,
													quote: quote.russian,
													source: source.russian,
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
