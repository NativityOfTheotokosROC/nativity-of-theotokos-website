import { createToast } from "@/src/lib/component/miscellaneous/utility";
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
import { InitializedModel } from "@mvc-react/mvc";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const NewQuote = function ({ model }) {
	const { modelView, interact } = model;
	const { newQuoteNotification } = modelView;
	const currentDate = formatInTimeZone(
		new Date(),
		"Africa/Harare",
		"yyyy-MM-dd",
	);
	const [authorField, setAuthorField] = useState("");
	const [sourceField, setSourceField] = useState("");
	const [quoteField, setQuoteField] = useState("");
	const [authorRuField, setAuthorRuField] = useState("");
	const [sourceRuField, setSourceRuField] = useState("");
	const [quoteRuField, setQuoteRuField] = useState("");
	const [scheduledDateField, setScheduledDateField] =
		useState<string>(currentDate);
	const [isQuoteScheduled, setIsQuoteScheduled] = useState(false);

	useEffect(() => {
		if (newQuoteNotification?.type == "success") {
			[
				setAuthorField,
				setSourceField,
				setQuoteField,
				setAuthorRuField,
				setSourceRuField,
				setQuoteRuField,
			].forEach(setter => setter(""));
			setIsQuoteScheduled(false);
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
					className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold md:text-black md:w-1/2 ${georgia.className}`}
				>
					{"New Quote"}
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
						const scheduledDate = isQuoteScheduled
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
					<div className="flex flex-col gap-6">
						<TabGroup className="flex flex-col gap-6">
							<TabList className="flex gap-1 items-center">
								<Tab
									className="flex items-center p-4 py-2 text-sm uppercase border-b-5 border-gray-300 data-selected:border-gray-900 data-hover:border-gray-600 focus:outline-none"
									as={"button"}
								>
									English
								</Tab>
								<Tab
									className="flex items-center p-4 py-2 text-sm uppercase border-b-5 border-gray-300 data-selected:border-gray-900 data-hover:border-gray-600 focus:outline-none"
									as={"button"}
								>
									Russian
								</Tab>
							</TabList>
							<TabPanels>
								<TabPanel
									className="flex flex-col gap-4"
									unmount={false}
								>
									<input
										className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
										placeholder="Author"
										name="author"
										id="quote-author"
										required
										autoCapitalize="words"
										value={authorField}
										onChange={e =>
											setAuthorField(e.target.value)
										}
									/>
									<input
										className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
										placeholder="Source (optional)"
										name="source"
										id="quote-source"
										value={sourceField}
										onChange={e =>
											setSourceField(e.target.value)
										}
									/>
									<textarea
										className="p-4 bg-white w-full rounded-lg border border-gray-400"
										placeholder="Quote"
										name="quote"
										rows={5}
										id="quote"
										required
										value={quoteField}
										onChange={e =>
											setQuoteField(e.target.value)
										}
									/>
								</TabPanel>
								<TabPanel
									className="flex flex-col gap-4"
									unmount={false}
								>
									<input
										className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
										placeholder="Author (optional)"
										name="authorRu"
										id="quote-author-ru"
										autoCapitalize="words"
										value={authorRuField}
										onChange={e =>
											setAuthorRuField(e.target.value)
										}
									/>
									<input
										className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
										placeholder="Source (optional)"
										name="sourceRu"
										id="quote-source-ru"
										value={sourceRuField}
										onChange={e =>
											setSourceRuField(e.target.value)
										}
									/>
									<textarea
										className="p-4 bg-white w-full rounded-lg border border-gray-400"
										placeholder="Quote (optional)"
										name="quoteRu"
										rows={5}
										id="quote-ru"
										value={quoteRuField}
										onChange={e =>
											setQuoteRuField(e.target.value)
										}
									/>
								</TabPanel>
							</TabPanels>
						</TabGroup>
						<div className="flex flex-col gap-3">
							<Field className="flex items-center gap-3">
								<Checkbox
									checked={isQuoteScheduled}
									onChange={setIsQuoteScheduled}
									className={`group flex justify-center items-center size-6 rounded bg-white data-checked:bg-gray-900 border border-gray-400`}
								>
									<Check
										className={
											"size-4 hidden stroke-white group-data-checked:block"
										}
									/>
								</Checkbox>
								<Label>
									{"Display the quote on a specific date"}
								</Label>
							</Field>
							{isQuoteScheduled && (
								<input
									className="p-4 bg-white w-full rounded-lg overflow-clip border border-gray-400"
									type="date"
									value={scheduledDateField}
									min={currentDate}
									onChange={e =>
										setScheduledDateField(e.target.value)
									}
									name="scheduledDate"
									id="scheduled-date"
									required
								/>
							)}
						</div>
						<hr className="w-full mt-2" />
						<div className="flex mt-2 gap-3 justify-start w-full">
							<button
								type="button"
								className="bg-[#513433] text-white p-4 w-[8em] rounded-lg hover:bg-[#250203]/90 active:bg-[#250203] disabled:bg-[#250203]/50"
								onClick={async () => {}}
								disabled
							>
								Preview
							</button>
							<button
								type="submit"
								className="bg-[#513433] text-white p-4 w-[8em] rounded-lg hover:bg-[#250203]/90 active:bg-[#250203] disabled:bg-[#250203]/30"
								disabled={
									newQuoteNotification?.type == "pending"
								}
							>
								Add Quote
							</button>
						</div>
					</div>
				</form>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<NewQuoteModel>>;

export default NewQuote;
