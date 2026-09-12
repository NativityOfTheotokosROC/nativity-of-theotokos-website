import { useAutoCompleteBox } from "@/src/lib/model-implementations/auto-complete-box";
import { ScheduleEventModel } from "@/src/lib/models/schedule-event";
import { CompleteTranslation } from "@/src/lib/utilities/types";
import {
	useInstantaneousScheduleItemSchema,
	useRecurringScheduleItemSchema,
} from "@/src/lib/validation/schedule-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { Controller, useForm } from "react-hook-form";
import AutoCompleteBox from "../../auto-complete-box/AutoCompleteBox";
import { autoCompleteFields } from "@/src/lib/utilities/auto-complete-box";
import { useTranslations } from "next-intl";

const ScheduleEvent = function ({ model }) {
	const {
		modelView: { scheduleEvent, autoCompleteInfo },
		interact,
	} = model;
	const instantaneousScheduleItemSchema =
		useInstantaneousScheduleItemSchema();
	const recurringScheduleItemSchema = useRecurringScheduleItemSchema();
	const t = useTranslations("scheduler");
	const {
		setValue,
		reset,
		register,
		handleSubmit,
		control,
		formState: { isSubmitting, isValid, errors },
	} = useForm({
		resolver: zodResolver(
			scheduleEvent.type === "specific"
				? instantaneousScheduleItemSchema
				: recurringScheduleItemSchema,
		),
		shouldUnregister: true,
		defaultValues: scheduleEvent.type === "specific" ? {} : {},
	});
	const englishTitleAutoCompleteBox = useAutoCompleteBox(
		{
			id: "english-title",
			items: autoCompleteInfo?.titleTranslations ?? [],
			transformer: title => title.english,
		},
		title => {
			setValue("title", title);
		},
	);
	const russianTitleAutoCompleteBox = useAutoCompleteBox(
		{
			id: "russian-title",
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
			id: "english-venue",
			items: autoCompleteInfo?.venueTranslations ?? [],
			transformer: venue => venue.english,
		},
		venue => {
			setValue("venue", venue);
		},
	);
	const russianVenueAutoCompleteBox = useAutoCompleteBox(
		{
			id: "russian-venue",
			items: (autoCompleteInfo?.venueTranslations?.filter(
				venue => venue.russian !== null,
			) ?? []) as CompleteTranslation[],
			transformer: venue => venue.russian,
		},
		venue => {
			setValue("venue", venue);
		},
	);
	// const englishDesignationAutoCompleteBox = useAutoCompleteBox(
	// 	{
	// 		id: "english-designation",
	// 		items: autoCompleteInfo?.designationTranslations ?? [],
	// 		transformer: designation => designation.english,
	// 	},
	// 	designation => {
	// 		setValue("designation", designation);
	// 	},
	// );
	// const russianDesignationAutoCompleteBox = useAutoCompleteBox(
	// 	{
	// 		id: "russian-designation",
	// 		items: (autoCompleteInfo?.designationTranslations?.filter(
	// 			designation => designation.russian !== null,
	// 		) ?? []) as CompleteTranslation[],
	// 		transformer: designation => designation.russian,
	// 	},
	// 	designation => {
	// 		setValue("designation", designation);
	// 	},
	// );
	const englishTitleFields = autoCompleteFields(englishTitleAutoCompleteBox);
	const russianTitleFields = autoCompleteFields(russianTitleAutoCompleteBox);
	const englishVenueFields = autoCompleteFields(englishVenueAutoCompleteBox);
	const russianVenueFields = autoCompleteFields(russianVenueAutoCompleteBox);
	// const englishDesignations = autoCompleteFields(
	// 	englishDesignationAutoCompleteBox,
	// );
	// const russianDesignationFieldCallbacks = autoCompleteFields(
	// 	russianDesignationAutoCompleteBox,
	// );

	return (
		<>
			<AutoCompleteBox model={englishTitleAutoCompleteBox} />
			<AutoCompleteBox model={russianTitleAutoCompleteBox} />
			<AutoCompleteBox model={englishVenueAutoCompleteBox} />
			<AutoCompleteBox model={russianVenueAutoCompleteBox} />
			{/* <AutoCompleteBox model={englishDesignationAutoCompleteBox} />
			<AutoCompleteBox model={russianDesignationAutoCompleteBox} /> */}
			<form onSubmit={handleSubmit(async form => {})}>
				<div className="flex flex-col gap-4">
					<span className="text-xl">{t("eventSection")}</span>
					<div className="flex flex-col gap-3">
						<Controller
							name="title.english"
							control={control}
							render={({
								field: { onChange, onBlur, name, value },
							}) => (
								<input
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.title?.english ? "border-red-800" : "border-gray-400"}`}
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
									onChange={async e => {
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
							name="title.russian"
							control={control}
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
									onChange={async e => {
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
							name="venue.english"
							control={control}
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
									onChange={async e => {
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
							name="venue.russian"
							control={control}
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
									onChange={async e => {
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
					</div>
					<span className="text-xl">{t("timesSection")}</span>
					<div className="flex flex-col gap-3"></div>
				</div>
			</form>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<ScheduleEventModel>>;

export default ScheduleEvent;
