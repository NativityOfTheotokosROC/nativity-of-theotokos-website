"use client";

import { useEditArticle } from "@/src/lib/model-implementations/edit-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import EditArticle from "./EditArticle";
import { EditArticleModelView } from "@/src/lib/models/edit-article";
import { toastNotifierVIInterface } from "@/src/lib/model-implementations/notifier";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";

const EditArticleClient = function ({ model }) {
	const { ticketId, author, lastSavedDraft, currentArticle } =
		model.modelView;
	const toastNotifier = useNewStatefulInteractiveModel(
		toastNotifierVIInterface(),
	);
	const article = useEditArticle(ticketId, {
		author,
		lastSavedDraft,
		toastNotifier,
		currentArticle,
	});

	return <EditArticle model={article} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<
		Pick<
			EditArticleModelView,
			"ticketId" | "lastSavedDraft" | "author" | "currentArticle"
		>
	>
>;

export default EditArticleClient;
