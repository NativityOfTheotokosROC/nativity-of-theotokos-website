"use client";

import { useToastNotifier } from "@/src/lib/model-implementations/notifier";
import { ManageQuotesModelView } from "@/src/lib/models/manage-quotes";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import ManageQuotes from "./ManageQuotes";
import { useManageQuotes } from "@/src/lib/model-implementations/manage-quotes";

const ManageQuotesClient = function ({ model }) {
	const { quotes, scheduledQuotes, autoCompleteInfo } = model.modelView;
	const toastNotifier = useToastNotifier();
	const manageQuotes = useManageQuotes(
		{ quotes, scheduledQuotes, autoCompleteInfo },
		toastNotifier,
	);
	return <ManageQuotes model={manageQuotes} />;
} satisfies ModeledVoidComponent<ReadonlyModel<ManageQuotesModelView>>;

export default ManageQuotesClient;
