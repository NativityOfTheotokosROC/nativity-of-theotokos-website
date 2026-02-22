import {
	InitializedModel,
	InputModelInteraction,
	InteractiveModel,
} from "@mvc-react/mvc";
import { Notification } from "../type/miscellaneous";

export type MailingListStatus =
	| (Notification<"subscribed"> & { text: string })
	| (Notification<"failed"> & { message: string })
	| Notification<"pending">;

export interface MailingListRepositoryModelView {
	mailingListStatus: MailingListStatus | null;
}

export type MailingListRepositoryModelInteraction = InputModelInteraction<
	"SUBSCRIBE",
	{ email: string }
>;

export type MailingListRepositoryModel = InitializedModel<
	InteractiveModel<
		MailingListRepositoryModelView,
		MailingListRepositoryModelInteraction
	>
>;
