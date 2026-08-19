"use client";

import { toastNotifierVIInterface } from "@/src/lib/model-implementations/notifier";
import { useWriteArticle } from "@/src/lib/model-implementations/write-article";
import { WriteArticleModelView } from "@/src/lib/models/write-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import WriteArticle from "./WriteArticle";

const WriteArticleClient = function ({ model }) {
	const {
		ticketId,
		author,
		lastSavedDraft,
		currentArticle,
		canDeleteTicket,
	} = model.modelView;
	const toastNotifier = useNewStatefulInteractiveModel(
		toastNotifierVIInterface(),
	);
	const writeArticle = useWriteArticle(ticketId, {
		author,
		lastSavedDraft,
		toastNotifier,
		currentArticle,
		canDeleteTicket,
	});

	return <WriteArticle model={writeArticle} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<
		Pick<
			WriteArticleModelView,
			| "ticketId"
			| "lastSavedDraft"
			| "author"
			| "currentArticle"
			| "canDeleteTicket"
		>
	>
>;

export default WriteArticleClient;
