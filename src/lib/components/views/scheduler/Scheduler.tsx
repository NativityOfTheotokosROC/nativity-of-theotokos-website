import { SchedulerModel } from "@/src/lib/models/scheduler";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import PageView from "../../page-view/PageView";
import { useTabs } from "@/src/lib/model-implementations/tabs";
import Tabs from "../../tabs/Tabs";

const Scheduler = function ({ model }) {
	const { modelView, interact } = model;
	const {
		scheduleItems: {
			instantaneousScheduleItems,
			recurringScheduleItems,
			instantaneousScheduleItemsPage,
		},
		autoCompleteInfo,
	} = modelView;
	const t = useTranslations("scheduler");
	const tabs = useTabs(
		[
			{ modelView: { name: t("scheduleEventTab") } },
			{ modelView: { name: t("viewScheduleTab") } },
			{ modelView: { name: t("modifyExistingTab") } },
		],
		"center",
	);

	return (
		<PageView model={newReadonlyModel({ title: t("title") })}>
			<Tabs model={tabs}>
				<></>
				<></>
			</Tabs>
		</PageView>
	);
} satisfies ModeledVoidComponent<InitializedModel<SchedulerModel>>;

export default Scheduler;
