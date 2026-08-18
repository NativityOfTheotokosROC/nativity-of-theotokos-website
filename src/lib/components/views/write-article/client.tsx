"use client";

import { useWriteArticle } from "@/src/lib/model-implementations/write-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import WriteArticle from "./WriteArticle";
import { WriteArticleModelView } from "@/src/lib/models/write-article";
import { toastNotifierVIInterface } from "@/src/lib/model-implementations/notifier";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import InformationView from "../../information-view/InformationView";
import { useTranslations } from "next-intl";
import SubmitGraphic from "@/public/assets/icon-2.svg";
import DiscardGraphic from "@/public/assets/graphic-1.svg";
import GoHomeButton from "../../button/GoHomeButton";

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
	const t = useTranslations("writeArticle");
	const tMisc = useTranslations("miscellaneous");
	const writeArticle = useWriteArticle(ticketId, {
		author,
		lastSavedDraft,
		toastNotifier,
		currentArticle,
		canDeleteTicket,
	});
	const { notification: writeArticleNotification } = writeArticle.modelView;

	if (writeArticleNotification?.type === "submit_success")
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
	if (writeArticleNotification?.type === "discard_draft_success")
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
