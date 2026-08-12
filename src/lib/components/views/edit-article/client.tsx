"use client";

import { useEditArticle } from "@/src/lib/model-implementations/edit-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import EditArticle from "./EditArticle";
import { EditArticleModelView } from "@/src/lib/models/new-article";
import { toastNotifierVIInterface } from "@/src/lib/model-implementations/notifier";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";

const EditArticleClient = function ({ model }) {
	const { ticketId, author, lastSavedDraft } = model.modelView;
	const toastNotifier = useNewStatefulInteractiveModel(
		toastNotifierVIInterface(),
	);
	const newArticle = useEditArticle(ticketId, {
		author,
		lastSavedDraft,
		toastNotifier,
	});

	return <EditArticle model={newArticle} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<
		Pick<EditArticleModelView, "ticketId" | "lastSavedDraft" | "author">
	>
>;

export default EditArticleClient;
