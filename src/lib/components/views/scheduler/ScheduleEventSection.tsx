import { useAutoCompleteBox } from "@/src/lib/model-implementations/auto-complete-box";
import { ScheduleEventModel } from "@/src/lib/models/schedule-event";
import { CompleteTranslation } from "@/src/lib/types/general";
import {
	useInstantaneousScheduleItemSchema,
	useRecurringScheduleItemSchema,
} from "@/src/lib/validation/schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { useForm } from "react-hook-form";

const ScheduleEvent = function ({ model }) {
	const {
		modelView: { scheduleEvent, autoCompleteInfo },
		interact,
	} = model;
	const instantaneousScheduleItemSchema =
		useInstantaneousScheduleItemSchema();
	const recurringScheduleItemSchema = useRecurringScheduleItemSchema();
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
		defaultValues: {},
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

	return <div className=""></div>;
} satisfies ModeledVoidComponent<InitializedModel<ScheduleEventModel>>;

export default ScheduleEvent;
