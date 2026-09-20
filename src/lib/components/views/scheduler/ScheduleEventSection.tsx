import Button from "@/src/lib/components/button/Button";
import { useAutoCompleteBox } from "@/src/lib/model-implementations/auto-complete-box";
import { ScheduleEventModel } from "@/src/lib/models/schedule-event";
import { autoCompleteFields } from "@/src/lib/utilities/auto-complete-box";
import { BLANK_TRANSLATION } from "@/src/lib/utilities/constants";
import { getDateString } from "@/src/lib/utilities/date-time";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import { CompleteTranslation, Translation } from "@/src/lib/utilities/types";
import {
	ALL_DAYS_ARRAY,
	Day,
	transformDaysToPattern,
	transformPatternToDays,
} from "@/src/lib/utilities/weekday-selector";
import {
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
	const {
		modelView: { scheduleEvent, autoCompleteInfo, options },
		interact,
	} = model;
	const instantaneousScheduleItemSchema =
		useInstantaneousScheduleItemSchema();
	const recurringScheduleItemSchema = useRecurringScheduleItemSchema();
	const t = useTranslations("scheduler");
	const {
		getValues,
		setValue,
		watch,
		reset,
		register,
		handleSubmit,
		control,
		formState: { isSubmitting, isValid, errors, isDirty },
	} = useForm({
		resolver: zodResolver(
			scheduleEvent.type === "specific"
				? instantaneousScheduleItemSchema
				: recurringScheduleItemSchema,
		),
		shouldUnregister: true,
		defaultValues: {
			title: BLANK_TRANSLATION,
			venue: BLANK_TRANSLATION,
			date: getDateString(addDays(new Date(), 1), true),
			times: [{ designation: BLANK_TRANSLATION, time: "09:00" }],
		},
		mode: "onChange",
	});
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
	const currentDate = getDateString(new Date(), true);
	const existingItemId =
		scheduleEvent.scheduleItem && "id" in scheduleEvent.scheduleItem
			? scheduleEvent.scheduleItem.id
			: undefined;
	const currentForm = JSON.stringify(watch());
	const [lastForm, setLastForm] = useState(currentForm);

	if (lastForm !== currentForm) {
		setLastForm(currentForm);
	}

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
			reset();
		}
	}, [reset, scheduleEvent]);

	useEffect(() => {
		if (isValid && isDirty && options?.isNewEventValidCallback) {
			if (scheduleEvent.type === "recurring") {
				const newEvent = {
					type: "recurring",
					scheduleItem:
						recurringScheduleItemSchema.safeParse(currentForm).data,
				} as const;
				options.isNewEventValidCallback!(
					newEvent.scheduleItem
						? {
								...newEvent,
								scheduleItem: newEvent.scheduleItem,
							}
						: undefined,
				);
			} else {
				const parsedForm =
					instantaneousScheduleItemSchema.safeParse(currentForm);
				console.log(parsedForm);
				const newEvent = {
					type: "specific",
					scheduleItem: parsedForm.data,
				} as const;
				options.isNewEventValidCallback!(
					newEvent.scheduleItem
						? {
								...newEvent,
								scheduleItem: newEvent.scheduleItem,
							}
						: undefined,
				);
			}
		} else {
			options?.isNewEventValidCallback?.(undefined);
		}
	}, [
		currentForm,
		instantaneousScheduleItemSchema,
		isDirty,
		isValid,
		options,
		recurringScheduleItemSchema,
		scheduleEvent.type,
	]);

	useCloseWarning(() => isDirty);

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
					<span className="text-xl">{t("eventSection")}</span>
					<div className="flex flex-col gap-3">
						<Controller
							control={control}
							name="title.english"
							render={({
								field: { onChange, onBlur, name, value },
								fieldState: { error },
							}) => (
								<input
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("titleFieldEn")}
									autoCapitalize="words"
									name={name}
									value={value}
									autoComplete={
										englishTitleFields.autoComplete
									}
									data-tooltip-id={
										englishTitleFields.dataTooltipId
									}
									onChange={e => {
										onChange(e);
										englishTitleFields.onChange(
											e.target.value,
										);
									}}
									onBlur={() => {
										onBlur();
										englishTitleFields.onBlur();
									}}
								/>
							)}
						/>
						<Controller
							control={control}
							name="title.russian"
							render={({
								field: { onChange, onBlur, name, value },
							}) => (
								<input
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.title?.russian ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("titleFieldRu")}
									autoCapitalize="words"
									name={name}
									value={
										typeof value === "string" ? value : ""
									}
									autoComplete={
										russianTitleFields.autoComplete
									}
									data-tooltip-id={
										russianTitleFields.dataTooltipId
									}
									onChange={e => {
										onChange(e);
										russianTitleFields.onChange(
											e.target.value,
										);
									}}
									onBlur={() => {
										onBlur();
										russianTitleFields.onBlur();
									}}
								/>
							)}
						/>
						<Controller
							control={control}
							name="venue.english"
							render={({
								field: { onChange, onBlur, name, value },
							}) => (
								<input
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.venue?.english ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("venueFieldEn")}
									autoCapitalize="words"
									name={name}
									value={value}
									autoComplete={
										englishVenueFields.autoComplete
									}
									data-tooltip-id={
										englishVenueFields.dataTooltipId
									}
									onChange={e => {
										onChange(e);
										englishVenueFields.onChange(
											e.target.value,
										);
									}}
									onBlur={() => {
										onBlur();
										englishVenueFields.onBlur();
									}}
								/>
							)}
						/>
						<Controller
							control={control}
							name="venue.russian"
							render={({
								field: { onChange, onBlur, name, value },
							}) => (
								<input
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.venue?.russian ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("venueFieldRu")}
									autoCapitalize="words"
									name={name}
									value={
										typeof value === "string" ? value : ""
									}
									autoComplete={
										russianVenueFields.autoComplete
									}
									data-tooltip-id={
										russianVenueFields.dataTooltipId
									}
									onChange={e => {
										onChange(e);
										russianVenueFields.onChange(
											e.target.value,
										);
									}}
									onBlur={() => {
										onBlur();
										russianVenueFields.onBlur();
									}}
								/>
							)}
						/>
						{scheduleEvent.type === "specific" && (
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
						)}
						{scheduleEvent.type === "recurring" && (
							<>
								<Controller
									control={control}
									name="recurringPattern"
									render={({
										field: { value, onChange },
										fieldState: {},
									}) => {
										const days =
											typeof value === "string"
												? (transformPatternToDays(
														value,
													) ?? new Set<Day>())
												: new Set<Day>();
										const dayTranslationMap = new Map(
											ALL_DAYS_ARRAY.map(DAY => {
												let translation;
												switch (DAY) {
													case "Sun":
														translation =
															t("sundayAbbrev");
														break;
													case "Mon":
														translation =
															t("mondayAbbrev");
														break;
													case "Tue":
														translation =
															t("tuesdayAbbrev");
														break;
													case "Wed":
														translation =
															t(
																"wednesdayAbbrev",
															);
														break;
													case "Thur":
														translation =
															t("thursdayAbbrev");
														break;
													case "Fri":
														translation =
															t("fridayAbbrev");
														break;
													case "Sat":
														translation =
															t("saturdayAbbrev");
														break;
												}
												return [
													DAY,
													translation,
												] as const;
											}),
										);
										return (
											<div className="flex gap-1">
												{dayTranslationMap
													.entries()
													.map(
														([
															day,
															translation,
														]) => (
															<Checkbox
																key={day}
																model={newReadonlyModel(
																	{
																		label: translation,
																		isChecked:
																			days.has(
																				day,
																			),
																		options:
																			{
																				labelPosition:
																					"top",
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
																					days.size >
																						0
																						? value
																						: undefined,
																				);
																			onChange(
																				newPattern,
																			);
																		},
																	},
																)}
															/>
														),
													)}
											</div>
										);
									}}
								/>
							</>
						)}
					</div>
					<span className="text-xl">{t("timesSection")}</span>
					<div className="flex flex-col gap-3">
						<Button
							model={newReadonlyModel({
								title: t("addTime"),
								variant: "alternative",
								action() {
									setValue("times", [
										...getValues("times"),
										{
											designation: BLANK_TRANSLATION,
											time: "09:00",
										},
									]);
								},
							})}
						>
							{t("addTime")}
						</Button>
						<div className="flex flex-col gap-2">
							{watch("times").map((_, index) => (
								<div
									key={index}
									className="flex flex-col gap-1 md:flex-row"
								>
									<Controller
										control={control}
										name={`times.${index}.designation`}
										render={({
											field: {
												name,
												onChange,
												onBlur,
												value,
											},
											fieldState: { error },
										}) => (
											<>
												<input
													className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
													placeholder={t(
														"designationFieldEn",
													)}
													autoCapitalize="words"
													name={`${name}.english`}
													value={value.english}
													autoComplete={"off"}
													data-tooltip-id={`${name}.english`}
													onChange={e => {
														onChange({
															...value,
															english:
																e.target.value,
														});
														englishDesignationFields.onChange(
															e.target.value,
															`${name}.english`,
														);
													}}
													onBlur={() => {
														onBlur();
														englishDesignationFields.onBlur();
													}}
												/>
												<input
													className={`w-full overflow-clip rounded-lg border bg-white p-4 ${error ? "border-red-800" : "border-gray-400"}`}
													placeholder={t(
														"designationFieldRu",
													)}
													autoCapitalize="words"
													name={`${name}.russian`}
													value={
														typeof value.russian ===
														"string"
															? value.russian
															: ""
													}
													autoComplete={"off"}
													data-tooltip-id={`${name}.russian`}
													onChange={e => {
														onChange({
															...value,
															russian:
																e.target.value,
														});
														russianDesignationFields.onChange(
															e.target.value,
															`${name}.russian`,
														);
													}}
													onBlur={() => {
														onBlur();
														russianDesignationFields.onBlur();
													}}
												/>
											</>
										)}
									/>
									<Controller
										control={control}
										name={`times.${index}.time`}
										render={({
											field: {
												name,
												onChange,
												onBlur,
												value,
											},
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
											action() {
												setValue(
													"times",
													getValues(
														"times",
													).toSpliced(index, 1),
												);
											},
										})}
									>
										<Trash2Icon strokeWidth={1.5} />
									</Button>
								</div>
							))}
						</div>
					</div>
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
} satisfies ModeledVoidComponent<InitializedModel<ScheduleEventModel>>;

export default ScheduleEventSection;
