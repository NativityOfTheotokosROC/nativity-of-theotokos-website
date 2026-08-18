"use client";

import { useEditArticle } from "@/src/lib/model-implementations/edit-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import EditArticle from "./EditArticle";
import { EditArticleModelView } from "@/src/lib/models/edit-article";
import { toastNotifierVIInterface } from "@/src/lib/model-implementations/notifier";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import InformationView from "../../information-view/InformationView";
import { useTranslations } from "next-intl";
import SubmitGraphic from "@/public/assets/icon-2.svg";
import DiscardGraphic from "@/public/assets/graphic-1.svg";
import GoHomeButton from "../../button/GoHomeButton";

const EditArticleClient = function ({ model }) {
	const { ticketId, author, lastSavedDraft, currentArticle } =
		model.modelView;
	const toastNotifier = useNewStatefulInteractiveModel(
		toastNotifierVIInterface(),
	);
	const t = useTranslations("editArticle");
	const tMisc = useTranslations("miscellaneous");
	const editArticle = useEditArticle(ticketId, {
		author,
		lastSavedDraft,
		toastNotifier,
		currentArticle,
	});

	if (editArticle.modelView.notification?.type === "submit_success")
		return (
			<InformationView
				model={newReadonlyModel({
					mainMessage: t("mainMessage"),
					detailedMessage: t("detailedMessage"),
					Graphic: SubmitGraphic,
				})}
			>
				<GoHomeButton>{tMisc("continue")}</GoHomeButton>
			</InformationView>
		);
	if (editArticle.modelView.notification?.type === "discard_draft_success")
		return (
			<InformationView
				model={newReadonlyModel({
					mainMessage: t("discardDraftMainMessage"),
					detailedMessage: t("discardDraftSuccess"),
					Graphic: DiscardGraphic,
				})}
			>
				<GoHomeButton>{tMisc("continue")}</GoHomeButton>
			</InformationView>
		);
	return <EditArticle model={editArticle} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<
		Pick<
			EditArticleModelView,
			| "ticketId"
			| "lastSavedDraft"
			| "author"
			| "currentArticle"
			| "canDeleteTicket"
		>
	>
>;

export default EditArticleClient;
