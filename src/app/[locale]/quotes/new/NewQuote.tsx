import { createToast } from "@/src/lib/component/miscellaneous/utility";
import Spinner from "@/src/lib/component/spinner/Spinner";
import { NewQuoteModel } from "@/src/lib/model/new-quote";
import { georgia } from "@/src/lib/third-party/fonts";
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
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type NewQuoteFields = {
	authorField: string;
	sourceField: string;
	quoteField: string;
	authorRuField: string;
	sourceRuField: string;
	quoteRuField: string;
	isQuoteScheduledField: boolean;
	scheduledDateField: string;
};

function getCurrentDate() {
	return formatInTimeZone(new Date(), "Africa/Harare", "yyyy-MM-dd");
}

function getDefaultFields() {
	const currentDate = getCurrentDate();
	return {
		authorField: "",
		authorRuField: "",
		quoteField: "",
		quoteRuField: "",
		sourceField: "",
		sourceRuField: "",
		isQuoteScheduledField: false,
		scheduledDateField: currentDate,
	} satisfies NewQuoteFields;
}

const NewQuote = function ({ model }) {
	const currentDate = getCurrentDate();
	const t = useTranslations("newQuote");
	const { modelView, interact } = model;
	const { newQuoteNotification } = modelView;
	const [fields, setFields] = useState<NewQuoteFields>(getDefaultFields());
	const {
		authorField,
		authorRuField,
		quoteField,
		quoteRuField,
		sourceField,
		sourceRuField,
		isQuoteScheduledField,
		scheduledDateField,
	} = fields;

	useEffect(() => {
		if (newQuoteNotification?.type == "success") {
			setFields(getDefaultFields());
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
					className={`text-[2.75rem]/tight mb-2 font-semibold md:text-black md:w-3/4 lg:w-6/10 ${georgia.className}`}
				>
					{t("title")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<form
					action={() => {
						const author = authorField.trim();
						const source = sourceField.trim()
							? sourceField
							: undefined;
						const quote = quoteField.trim();
						const authorRu = authorRuField.trim()
							? authorRuField
							: undefined;
						const sourceRu = sourceRuField.trim()
							? sourceRuField
							: undefined;
						const quoteRu = quoteRuField.trim()
							? quoteRuField
							: undefined;
						const scheduledDate = isQuoteScheduledField
							? toZonedTime(scheduledDateField, "Africa/Harare")
							: undefined;

						interact({
							type: "ADD_QUOTE",
							input: {
								englishQuote: {
									author,
									quote,
									source,
								},
								russianQuote: {
									author: authorRu,
									quote: quoteRu,
									source: sourceRu,
								},
								scheduledDate,
							},
						});
					}}
				>
					<div className="flex flex-col md:w-1/2 gap-6">
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
										className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
										placeholder={t("author")}
										name="author"
										id="quote-author"
										required
										autoCapitalize="words"
										autoComplete="on"
										value={authorField}
										onChange={e =>
											setFields({
												...fields,
												authorField: e.target.value,
											})
										}
									/>
									<input
										className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
										placeholder={`${t("source")} (${t("optional")})`}
										name="source"
										id="quote-source"
										autoComplete="on"
										value={sourceField}
										onChange={e =>
											setFields({
												...fields,
												sourceField: e.target.value,
											})
										}
									/>
									<textarea
										className="p-4 bg-white w-full rounded-lg border border-gray-400"
										placeholder={t("quote")}
										name="quote"
										rows={5}
										id="quote"
										autoComplete="off"
										required
										value={quoteField}
										onChange={e =>
											setFields({
												...fields,
												quoteField: e.target.value,
											})
										}
									/>
								</TabPanel>
								<TabPanel
									className="flex flex-col gap-3"
									unmount={false}
								>
									<input
										className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
										placeholder={`${t("author")} (${t("optional")})`}
										name="authorRu"
										id="quote-author-ru"
										autoCapitalize="words"
										autoComplete="on"
										value={authorRuField}
										onChange={e =>
											setFields({
												...fields,
												authorRuField: e.target.value,
											})
										}
									/>
									<input
										className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
										placeholder={`${t("source")} (${t("optional")})`}
										name="sourceRu"
										id="quote-source-ru"
										autoComplete="on"
										value={sourceRuField}
										onChange={e =>
											setFields({
												...fields,
												sourceRuField: e.target.value,
											})
										}
									/>
									<textarea
										className="p-4 bg-white w-full rounded-lg border border-gray-400"
										placeholder={`${t("quote")} (${t("optional")})`}
										name="quoteRu"
										rows={5}
										id="quote-ru"
										autoComplete="off"
										value={quoteRuField}
										onChange={e =>
											setFields({
												...fields,
												quoteRuField: e.target.value,
											})
										}
									/>
								</TabPanel>
							</TabPanels>
						</TabGroup>
						<div className="flex flex-col gap-3">
							<Field className="flex items-center gap-3">
								<Checkbox
									checked={isQuoteScheduledField}
									onChange={value =>
										setFields({
											...fields,
											isQuoteScheduledField: value,
										})
									}
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
							{isQuoteScheduledField && (
								<input
									className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
									type="date"
									value={scheduledDateField}
									min={currentDate}
									onChange={e =>
										setFields({
											...fields,
											scheduledDateField: e.target.value,
										})
									}
									name="scheduledDate"
									id="scheduled-date"
									required
								/>
							)}
						</div>
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
