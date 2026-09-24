import Button from "@/src/lib/components/button/Button";
import { useAutoCompleteBox } from "@/src/lib/model-implementations/auto-complete-box";
import { AutoCompleteBoxModel } from "@/src/lib/models/auto-complete-box";
import {
	RecurringScheduleEventWithOptionalId,
	ScheduleEventModel,
	ScheduleEventModelView,
	SpecificScheduleEventWithOptionalId,
} from "@/src/lib/models/schedule-event";
import { autoCompleteFields } from "@/src/lib/utilities/auto-complete-box";
import { BLANK_TRANSLATION } from "@/src/lib/utilities/constants";
import { getDateString } from "@/src/lib/utilities/date-time";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import {
	CompleteTranslation,
	ReplaceModelViewPropertyType,
	Translation,
} from "@/src/lib/utilities/types";
import {
	ALL_DAYS_ARRAY,
	Day,
	transformDaysToPattern,
	transformPatternToDays,
} from "@/src/lib/utilities/weekday-selector";
import {
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
	NewScheduleItem,
	useInstantaneousScheduleItemSchema,
	useRecurringScheduleItemSchema,
} from "@/src/lib/validation/schedule-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { addDays } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AutoCompleteBox from "../../auto-complete-box/AutoCompleteBox";
import ButtonBar from "../../button-bar/ButtonBar";
import Checkbox from "../../checkbox/Checkbox";

const ScheduleEventSection = function ({ model }) {
	const { modelView } = model;
	const { scheduleEvent } = modelView;
	return (
		<div className="schedule-event scroll-mt-[2.5em] pt-3">
			{scheduleEvent.type === "specific" ? (
				<SpecificScheduleEventForm
					model={{
						...model,
						modelView: { ...modelView, scheduleEvent },
					}}
				/>
			) : (
				<RecurringScheduleEventForm
					model={{
						...model,
						modelView: { ...modelView, scheduleEvent },
					}}
				/>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<ScheduleEventModel>>;

export default ScheduleEventSection;

const RecurringScheduleEventForm = function ({ model }) {
	const t = useTranslations("scheduler");
	const {
		interact,
		modelView: { scheduleEvent, autoCompleteInfo, options },
	} = model;
	const {
		modelView: {
			form,
			englishTitleAutoCompleteBox,
			russianTitleAutoCompleteBox,
			englishVenueAutoCompleteBox,
			russianVenueAutoCompleteBox,
			englishDesignationsAutoCompleteBox,
			russianDesignationsAutoCompleteBox,
		},
	} = useScheduleEventSectionForm(
		scheduleEvent,
		options?.isNewEventValidCallback,
		autoCompleteInfo,
	);
	const {
		getValues,
		setValue,
		watch,
		handleSubmit,
		control,
		formState: { isSubmitting, isValid },
	} = form;
	const times = watch("times").map(
		({ time, designation: { english, russian } }) => ({
			time,
			designation: {
				english,
				russian: typeof russian === "string" ? russian : null,
			},
		}),
	);

	return (
		<>
			<AutoCompleteBox model={englishTitleAutoCompleteBox} />
			<AutoCompleteBox model={russianTitleAutoCompleteBox} />
			<AutoCompleteBox model={englishVenueAutoCompleteBox} />
			<AutoCompleteBox model={russianVenueAutoCompleteBox} />
			<AutoCompleteBox model={englishDesignationsAutoCompleteBox} />
			<AutoCompleteBox model={russianDesignationsAutoCompleteBox} />
			<form
				onSubmit={handleSubmit(async form => {
					const existingItemId = scheduleEvent.scheduleItem?.id;
					await interact({
						type: "SCHEDULE_EVENT",
						input:
							"recurringPattern" in form
								? {
										existingId: existingItemId,
										newEvent: {
											type: "recurring",
											scheduleItem: form,
										},
									}
								: {
										existingId: existingItemId,
										newEvent: {
											type: "specific",
											scheduleItem: form,
										},
									},
					});
				})}
			>
				<div className="flex flex-col gap-4">
					<span className="uppercase">{t("eventSection")}</span>
					<EventMetadataFormControl
						control={control}
						autoCompleteBoxes={{
							englishTitleAutoCompleteBox,
							englishVenueAutoCompleteBox,
							russianTitleAutoCompleteBox,
							russianVenueAutoCompleteBox,
						}}
					/>
					<Controller
						control={control}
						name="recurringPattern"
						render={({
							field: { value, onChange },
							fieldState: { error },
						}) => {
							const days =
								transformPatternToDays(value) ?? new Set<Day>();
							const dayTranslationMap = new Map(
								ALL_DAYS_ARRAY.map(DAY => {
									let translation;
									switch (DAY) {
										case "Sun":
											translation = t("sundayAbbrev");
											break;
										case "Mon":
											translation = t("mondayAbbrev");
											break;
										case "Tue":
											translation = t("tuesdayAbbrev");
											break;
										case "Wed":
											translation = t("wednesdayAbbrev");
											break;
										case "Thur":
											translation = t("thursdayAbbrev");
											break;
										case "Fri":
											translation = t("fridayAbbrev");
											break;
										case "Sat":
											translation = t("saturdayAbbrev");
											break;
									}
									return [DAY, translation] as const;
								}),
							);
							return (
								<div className="flex gap-1">
									{dayTranslationMap
										.entries()
										.map(([day, translation]) => (
											<Checkbox
												key={day}
												model={newReadonlyModel({
													label: translation,
													isChecked: days.has(day),
													options: {
														labelPosition: "top",
														checkboxClassName:
															error &&
															"border-red-800",
													},
													checkedChangeCallback(
														checked,
													) {
														const newPattern =
															transformDaysToPattern(
																checked
																	? days.union(
																			new Set(
																				[
																					day,
																				],
																			),
																		)
																	: days.difference(
																			new Set(
																				[
																					day,
																				],
																			),
																		),
																days.size > 0
																	? value
																	: undefined,
															);
														onChange(
															newPattern ?? "",
														);
													},
												})}
											/>
										))}
								</div>
							);
						}}
					/>
					<span className="uppercase">{t("timesSection")}</span>
					<EventTimesFormControl
						control={control}
						times={times}
						addTimeCallback={time => {
							setValue("times", [...getValues("times"), time]);
						}}
						removeTimeCallback={index => {
							setValue(
								"times",
								getValues("times").toSpliced(index, 1),
							);
						}}
						autoCompleteBoxes={{
							englishDesignationsAutoCompleteBox,
							russianDesignationsAutoCompleteBox,
						}}
					/>
					<ButtonBar
						model={newReadonlyModel({
							arrangement: "start",
							orientation: "horizontal",
						})}
					>
						{options?.previewCallback && (
							<Button
								model={newReadonlyModel({
									disabled: !isValid,
									action: () => {
										options.previewCallback!();
									},
								})}
							>
								{t("previewButton")}
							</Button>
						)}
						<Button
							model={newReadonlyModel({
								disabled: isSubmitting,
								type: "submit",
							})}
						>
							{scheduleEvent.scheduleItem &&
							"id" in scheduleEvent.scheduleItem
								? t("modifyButton")
								: t("scheduleButton")}
						</Button>
					</ButtonBar>
				</div>
			</form>
		</>
	);
} satisfies ModeledVoidComponent<
	InitializedModel<
		ReplaceModelViewPropertyType<
			ScheduleEventModel,
			"scheduleEvent",
			RecurringScheduleEventWithOptionalId
		>
	>
>;

const SpecificScheduleEventForm = function ({ model }) {
	const t = useTranslations("scheduler");
	const {
		interact,
		modelView: { scheduleEvent, autoCompleteInfo, options },
	} = model;
	const {
		modelView: {
			form,
			englishTitleAutoCompleteBox,
			russianTitleAutoCompleteBox,
			englishVenueAutoCompleteBox,
			russianVenueAutoCompleteBox,
			englishDesignationsAutoCompleteBox,
			russianDesignationsAutoCompleteBox,
		},
	} = useScheduleEventSectionForm(
		scheduleEvent,
		options?.isNewEventValidCallback,
		autoCompleteInfo,
	);
	const {
		getValues,
		setValue,
		watch,
		register,
		handleSubmit,
		control,
		formState: { isSubmitting, isValid, errors },
	} = form;
	const currentDate = getDateString(new Date(), true);
	const times = watch("times").map(
		({ time, designation: { english, russian } }) => ({
			time,
			designation: {
				english,
				russian: typeof russian === "string" ? russian : null,
			},
		}),
	);

	return (
		<>
			<AutoCompleteBox model={englishTitleAutoCompleteBox} />
			<AutoCompleteBox model={russianTitleAutoCompleteBox} />
			<AutoCompleteBox model={englishVenueAutoCompleteBox} />
			<AutoCompleteBox model={russianVenueAutoCompleteBox} />
			<AutoCompleteBox model={englishDesignationsAutoCompleteBox} />
			<AutoCompleteBox model={russianDesignationsAutoCompleteBox} />
			<form
				onSubmit={handleSubmit(async form => {
					const existingItemId = scheduleEvent.scheduleItem?.id;
					await interact({
						type: "SCHEDULE_EVENT",
						input:
							"recurringPattern" in form
								? {
										existingId: existingItemId,
										newEvent: {
											type: "recurring",
											scheduleItem: form,
										},
									}
								: {
										existingId: existingItemId,
										newEvent: {
											type: "specific",
											scheduleItem: form,
										},
									},
					});
				})}
			>
				<div className="flex flex-col gap-4">
					<span className="uppercase">{t("eventSection")}</span>
					<EventMetadataFormControl
						control={control}
						autoCompleteBoxes={{
							englishTitleAutoCompleteBox,
							englishVenueAutoCompleteBox,
							russianTitleAutoCompleteBox,
							russianVenueAutoCompleteBox,
						}}
					/>
					<>
						<input
							{...register("date")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors && "date" in errors && errors.date ? "border-red-800" : "border-gray-400"}`}
							type="date"
							formNoValidate
							min={currentDate}
						/>
						{errors && "date" in errors && errors.date && (
							<span className="text-sm text-red-800">
								{errors.date.message}
							</span>
						)}
					</>
					<span className="uppercase">{t("timesSection")}</span>
					<EventTimesFormControl
						control={control}
						times={times}
						addTimeCallback={time => {
							setValue("times", [...getValues("times"), time]);
						}}
						removeTimeCallback={index => {
							setValue(
								"times",
								getValues("times").toSpliced(index, 1),
							);
						}}
						autoCompleteBoxes={{
							englishDesignationsAutoCompleteBox,
							russianDesignationsAutoCompleteBox,
						}}
					/>
					<ButtonBar
						model={newReadonlyModel({
							arrangement: "start",
							orientation: "horizontal",
						})}
					>
						{options?.previewCallback && (
							<Button
								model={newReadonlyModel({
									disabled: !isValid,
									action: () => {
										options.previewCallback!();
									},
								})}
							>
								{t("previewButton")}
							</Button>
						)}
						<Button
							model={newReadonlyModel({
								disabled: isSubmitting,
								type: "submit",
							})}
						>
							{scheduleEvent.scheduleItem &&
							"id" in scheduleEvent.scheduleItem
								? t("modifyButton")
								: t("scheduleButton")}
						</Button>
					</ButtonBar>
				</div>
			</form>
		</>
	);
} satisfies ModeledVoidComponent<
	InitializedModel<
		ReplaceModelViewPropertyType<
			ScheduleEventModel,
			"scheduleEvent",
			SpecificScheduleEventWithOptionalId
		>
	>
>;
function EventMetadataFormControl({
	control,
	autoCompleteBoxes,
}: {
	control: ReturnType<
		typeof useScheduleEventSectionForm
	>["modelView"]["form"]["control"];
	autoCompleteBoxes?: {
		englishTitleAutoCompleteBox: InitializedModel<
			AutoCompleteBoxModel<Translation, `title.english`>
		>;
		russianTitleAutoCompleteBox: InitializedModel<
			AutoCompleteBoxModel<CompleteTranslation, `title.russian`>
		>;
		englishVenueAutoCompleteBox: InitializedModel<
			AutoCompleteBoxModel<Translation, `venue.english`>
		>;
		russianVenueAutoCompleteBox: InitializedModel<
			AutoCompleteBoxModel<CompleteTranslation, `venue.russian`>
		>;
	};
}) {
	const t = useTranslations("scheduler");
	const [
		englishTitleFields,
		russianTitleFields,
		englishVenuesFields,
		russianVenueFields,
	] = autoCompleteBoxes
		? [
				autoCompleteFields(
					autoCompleteBoxes.englishTitleAutoCompleteBox,
				),
				autoCompleteFields(
					autoCompleteBoxes.russianTitleAutoCompleteBox,
				),
				autoCompleteFields(
					autoCompleteBoxes.englishVenueAutoCompleteBox,
				),
				autoCompleteFields(
					autoCompleteBoxes.russianVenueAutoCompleteBox,
				),
			]
		: new Array<undefined>(4).fill(undefined);

	return (
		<div className="flex flex-col gap-3">
			<Controller
				control={control}
				name="title.english"
				render={({
					field: { onChange, onBlur, name, value },
					fieldState: { error },
				}) => (
					<>
						<input
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("titleFieldEn")}
							autoCapitalize="words"
							name={name}
							value={value}
							autoComplete={englishTitleFields?.autoComplete}
							data-tooltip-id={englishTitleFields?.dataTooltipId}
							onChange={e => {
								onChange(e);
								englishTitleFields?.onChange(e.target.value);
							}}
							onBlur={() => {
								onBlur();
								englishTitleFields?.onBlur();
							}}
						/>
						{error && (
							<span className="text-sm text-red-800">
								{error.message}
							</span>
						)}
					</>
				)}
			/>
			<Controller
				control={control}
				name="title.russian"
				render={({
					field: { onChange, onBlur, name, value },
					fieldState: { error },
				}) => (
					<>
						<input
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("titleFieldRu")}
							autoCapitalize="words"
							name={name}
							value={typeof value === "string" ? value : ""}
							autoComplete={russianTitleFields?.autoComplete}
							data-tooltip-id={russianTitleFields?.dataTooltipId}
							onChange={e => {
								onChange(e);
								russianTitleFields?.onChange(e.target.value);
							}}
							onBlur={() => {
								onBlur();
								russianTitleFields?.onBlur();
							}}
						/>
						{error && (
							<span className="text-sm text-red-800">
								{error.message}
							</span>
						)}
					</>
				)}
			/>
			<Controller
				control={control}
				name="venue.english"
				render={({
					field: { onChange, onBlur, name, value },
					fieldState: { error },
				}) => (
					<>
						<input
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("venueFieldEn")}
							autoCapitalize="words"
							name={name}
							value={value}
							autoComplete={englishVenuesFields?.autoComplete}
							data-tooltip-id={englishVenuesFields?.dataTooltipId}
							onChange={e => {
								onChange(e);
								englishVenuesFields?.onChange(e.target.value);
							}}
							onBlur={() => {
								onBlur();
								englishVenuesFields?.onBlur();
							}}
						/>
						{error && (
							<span className="text-sm text-red-800">
								{error.message}
							</span>
						)}
					</>
				)}
			/>
			<Controller
				control={control}
				name="venue.russian"
				render={({
					field: { onChange, onBlur, name, value },
					fieldState: { error },
				}) => (
					<>
						<input
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("venueFieldRu")}
							autoCapitalize="words"
							name={name}
							value={typeof value === "string" ? value : ""}
							autoComplete={russianVenueFields?.autoComplete}
							data-tooltip-id={russianVenueFields?.dataTooltipId}
							onChange={e => {
								onChange(e);
								russianVenueFields?.onChange(e.target.value);
							}}
							onBlur={() => {
								onBlur();
								russianVenueFields?.onBlur();
							}}
						/>
						{error && (
							<span className="text-sm text-red-800">
								{error.message}
							</span>
						)}
					</>
				)}
			/>
		</div>
	);
}
function EventTimesFormControl({
	control,
	times,
	addTimeCallback,
	removeTimeCallback,
	autoCompleteBoxes,
}: {
	control: ReturnType<
		typeof useScheduleEventSectionForm
	>["modelView"]["form"]["control"];
	times: NewScheduleItem["times"];
	addTimeCallback: (time: NewScheduleItem["times"][number]) => void;
	removeTimeCallback: (index: number) => void;
	autoCompleteBoxes?: {
		englishDesignationsAutoCompleteBox: InitializedModel<
			AutoCompleteBoxModel<
				Translation,
				`times.${number}.designation.english`
			>
		>;
		russianDesignationsAutoCompleteBox: InitializedModel<
			AutoCompleteBoxModel<
				CompleteTranslation,
				`times.${number}.designation.russian`
			>
		>;
	};
}) {
	const t = useTranslations("scheduler");
	const englishDesignationsFields = autoCompleteBoxes
		? autoCompleteFields(
				autoCompleteBoxes.englishDesignationsAutoCompleteBox,
			)
		: undefined;
	const russianDesignationsFields = autoCompleteBoxes
		? autoCompleteFields(
				autoCompleteBoxes.russianDesignationsAutoCompleteBox,
			)
		: undefined;

	return (
		<div className="flex flex-col gap-3">
			<Button
				model={newReadonlyModel({
					title: t("addTime"),
					variant: "alternative",
					action() {
						addTimeCallback({
							designation: BLANK_TRANSLATION,
							time: "09:00",
						});
					},
				})}
			>
				{t("addTime")}
			</Button>
			<div className="flex flex-col gap-2">
				{times.map((_, index) => (
					<div
						key={index}
						className="flex flex-col gap-1 md:flex-row"
					>
						<Controller
							control={control}
							name={`times.${index}.designation`}
							render={({
								field: { name, onChange, onBlur, value },
								fieldState: { error },
							}) => (
								<>
									<input
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
										placeholder={t("designationFieldEn")}
										autoCapitalize="words"
										name={`${name}.english`}
										value={value.english}
										autoComplete={"off"}
										data-tooltip-id={`${name}.english`}
										onChange={e => {
											onChange({
												...value,
												english: e.target.value,
											});
											englishDesignationsFields?.onChange(
												e.target.value,
												`${name}.english`,
											);
										}}
										onBlur={() => {
											onBlur();
											englishDesignationsFields?.onBlur();
										}}
									/>
									<input
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
										placeholder={t("designationFieldRu")}
										autoCapitalize="words"
										name={`${name}.russian`}
										value={
											typeof value.russian === "string"
												? value.russian
												: ""
										}
										autoComplete={"off"}
										data-tooltip-id={`${name}.russian`}
										onChange={e => {
											onChange({
												...value,
												russian: e.target.value,
											});
											russianDesignationsFields?.onChange(
												e.target.value,
												`${name}.russian`,
											);
										}}
										onBlur={() => {
											onBlur();
											russianDesignationsFields?.onBlur();
										}}
									/>
								</>
							)}
						/>
						<Controller
							control={control}
							name={`times.${index}.time`}
							render={({
								field: { name, onChange, onBlur, value },
								fieldState: { error },
							}) => (
								<>
									<input
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
										type="time"
										placeholder={t("timeField")}
										name={name}
										value={value}
										onChange={onChange}
										onBlur={onBlur}
										formNoValidate
									/>
								</>
							)}
						/>
						<Button
							model={newReadonlyModel({
								title: t("deleteTime"),
								variant: "alternative",
								className:
									"flex justify-center items-center w-fit",
								action: () => removeTimeCallback(index),
							})}
						>
							<Trash2Icon strokeWidth={1.5} />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}

function useScheduleEventSectionForm(
	scheduleEvent: ScheduleEventModelView["scheduleEvent"],
	isNewEventValidCallback: NonNullable<
		ScheduleEventModelView["options"]
	>["isNewEventValidCallback"],
	autoCompleteInfo?: ScheduleEventModelView["autoCompleteInfo"],
) {
	const instantaneousScheduleItemSchema =
		useInstantaneousScheduleItemSchema();
	const recurringScheduleItemSchema = useRecurringScheduleItemSchema();
	const form = useForm({
		resolver: zodResolver(
			scheduleEvent.type === "specific"
				? instantaneousScheduleItemSchema
				: recurringScheduleItemSchema,
		),
		shouldUnregister: true,
		defaultValues: defaultForm(),
		mode: "onChange",
	});
	const {
		getValues,
		setValue,
		reset,
		formState: { isValid, isDirty },
	} = form;

	const englishTitleAutoCompleteBox = useAutoCompleteBox(
		{
			id: "title.english",
			items: autoCompleteInfo?.titleTranslations ?? [],
			transformer: title => title.english,
		},
		title => {
			setValue("title", title);
		},
	);
	const russianTitleAutoCompleteBox = useAutoCompleteBox(
		{
			id: "title.russian",
			items: (autoCompleteInfo?.titleTranslations?.filter(
				title => title.russian !== null,
			) ?? []) as CompleteTranslation[],
			transformer: title => title.russian,
		},
		title => {
			setValue("title", title);
		},
	);
	const englishVenueAutoCompleteBox = useAutoCompleteBox(
		{
			id: "venue.english",
			items: autoCompleteInfo?.venueTranslations ?? [],
			transformer: venue => venue.english,
		},
		venue => {
			setValue("venue", venue);
		},
	);
	const russianVenueAutoCompleteBox = useAutoCompleteBox(
		{
			id: "venue.russian",
			items: (autoCompleteInfo?.venueTranslations?.filter(
				venue => venue.russian !== null,
			) ?? []) as CompleteTranslation[],
			transformer: venue => venue.russian,
		},
		venue => {
			setValue("venue", venue);
		},
	);
	const englishDesignationsAutoCompleteBox = useAutoCompleteBox<
		Translation,
		`times.${number}.designation.english`
	>(
		{
			id: "times.0.designation.english",
			items: autoCompleteInfo?.designationTranslations ?? [],
			transformer: designation => designation.english,
		},
		designation => {
			const index = Number(
				// eslint-disable-next-line react-hooks/immutability
				englishDesignationsAutoCompleteBox.modelView.id.split(".")[1],
			);
			setValue(`times.${index}.designation`, designation);
		},
	);
	const russianDesignationsAutoCompleteBox = useAutoCompleteBox<
		CompleteTranslation,
		`times.${number}.designation.russian`
	>(
		{
			id: "times.0.designation.russian",
			items: (autoCompleteInfo?.designationTranslations?.filter(
				designation => designation.russian !== null,
			) ?? []) as CompleteTranslation[],
			transformer: designation => designation.russian,
		},
		designation => {
			const index = Number(
				// eslint-disable-next-line react-hooks/immutability
				russianDesignationsAutoCompleteBox.modelView.id.split(".")[1],
			);
			setValue(`times.${index}.designation`, designation);
		},
	);
	const englishTitleFields = autoCompleteFields(englishTitleAutoCompleteBox);
	const russianTitleFields = autoCompleteFields(russianTitleAutoCompleteBox);
	const englishVenueFields = autoCompleteFields(englishVenueAutoCompleteBox);
	const russianVenueFields = autoCompleteFields(russianVenueAutoCompleteBox);
	const englishDesignationFields = autoCompleteFields(
		englishDesignationsAutoCompleteBox,
	);
	const russianDesignationFields = autoCompleteFields(
		russianDesignationsAutoCompleteBox,
	);
	const currentForm = JSON.stringify(getValues());
	const [lastForm, setLastForm] = useState(currentForm);

	if (lastForm !== currentForm) setLastForm(currentForm);

	useEffect(() => {
		const { scheduleItem } = scheduleEvent;
		if (scheduleItem) {
			reset(
				"date" in scheduleItem
					? {
							...scheduleItem,
							date: getDateString(scheduleItem.date, true),
						}
					: scheduleItem,
			);
		} else {
			reset(defaultForm());
		}
	}, [reset, scheduleEvent]);

	useEffect(() => {
		if (isValid && isDirty && isNewEventValidCallback) {
			if (scheduleEvent.type === "recurring") {
				const newEvent = {
					type: "recurring",
					scheduleItem:
						recurringScheduleItemSchema.safeParse(getValues()).data,
				} as const;
				isNewEventValidCallback!(
					newEvent.scheduleItem
						? {
								...newEvent,
								scheduleItem: newEvent.scheduleItem,
							}
						: undefined,
				);
			} else {
				const newEvent = {
					type: "specific",
					scheduleItem:
						instantaneousScheduleItemSchema.safeParse(getValues())
							.data,
				} as const;
				isNewEventValidCallback(
					newEvent.scheduleItem
						? {
								...newEvent,
								scheduleItem: newEvent.scheduleItem,
							}
						: undefined,
				);
			}
		} else {
			isNewEventValidCallback?.(undefined);
		}
	}, [
		currentForm,
		getValues,
		instantaneousScheduleItemSchema,
		isDirty,
		isValid,
		recurringScheduleItemSchema,
		scheduleEvent.type,
		isNewEventValidCallback,
	]);

	useCloseWarning(() => isDirty);

	const model = newReadonlyModel({
		form,
		englishTitleAutoCompleteBox,
		englishVenueAutoCompleteBox,
		englishDesignationsAutoCompleteBox,
		russianTitleAutoCompleteBox,
		russianVenueAutoCompleteBox,
		russianDesignationsAutoCompleteBox,
		englishTitleFields,
		englishVenueFields,
		englishDesignationFields,
		russianTitleFields,
		russianVenueFields,
		russianDesignationFields,
	});
	return model;
}

function defaultForm():
	| NewInstantaneousScheduleItem
	| NewRecurringScheduleItem {
	return {
		title: BLANK_TRANSLATION,
		venue: BLANK_TRANSLATION,
		date: getDateString(addDays(new Date(), 1), true),
		recurringPattern: "",
		times: [{ designation: BLANK_TRANSLATION, time: "09:00" }],
	};
}
