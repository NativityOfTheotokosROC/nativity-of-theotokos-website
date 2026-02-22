import { ReadonlyModel } from "@mvc-react/mvc";
import { MailingListRepositoryModel } from "./mailing-list-repository";

export interface MailingListSectionModelView {
	mailingListRepository: MailingListRepositoryModel;
}

export type MailingListSectionModel =
	ReadonlyModel<MailingListSectionModelView>;
