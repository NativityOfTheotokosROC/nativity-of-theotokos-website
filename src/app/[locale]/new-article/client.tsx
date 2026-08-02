"use client";

import { useNewArticle } from "@/src/lib/model-implementations/new-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import NewArticle from "./NewArticle";
import { NewArticleModelView } from "@/src/lib/models/new-article";
import { toastNotifierVIInterface } from "@/src/lib/model-implementations/notifier";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";

const NewArticleClient = function ({ model }) {
	const { ticketId, author, lastSavedDraft } = model.modelView;
	const toastNotifier = useNewStatefulInteractiveModel(
		toastNotifierVIInterface(),
	);
	const newArticle = useNewArticle(ticketId, {
		author,
		lastSavedDraft,
		toastNotifier,
	});

	return <NewArticle model={newArticle} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<
		Pick<NewArticleModelView, "ticketId" | "lastSavedDraft" | "author">
	>
>;

export default NewArticleClient;
