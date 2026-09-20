"use client";

import { useToastNotifier } from "@/src/lib/model-implementations/notifier";
import { useScheduler } from "@/src/lib/model-implementations/scheduler";
import { SchedulerModelView } from "@/src/lib/models/scheduler";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import Scheduler from "./Scheduler";

const SchedulerClient = function ({ model }) {
	const { scheduleItems, autoCompleteInfo, eventToEdit } = model.modelView;
	const toastNotifier = useToastNotifier();
	const scheduler = useScheduler(
		{ scheduleItems, autoCompleteInfo, eventToEdit },
		toastNotifier,
	);
	return <Scheduler model={scheduler} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<
		Pick<
			SchedulerModelView,
			"scheduleItems" | "autoCompleteInfo" | "eventToEdit"
		>
	>
>;

export default SchedulerClient;
