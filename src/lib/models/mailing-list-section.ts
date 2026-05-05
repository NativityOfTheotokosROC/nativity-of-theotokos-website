import { ReadonlyModel } from "@mvc-react/mvc";
import { MailingListRepositoryModel } from "./mailing-list-repository";

export type MailingListSectionModelView = {
	mailingListRepository: MailingListRepositoryModel;
};

export type MailingListSectionModel =
	ReadonlyModel<MailingListSectionModelView>;
