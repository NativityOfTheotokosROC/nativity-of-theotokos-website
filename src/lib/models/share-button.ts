import { ReadonlyModel } from "@mvc-react/mvc";
import { ShareData } from "../utilities/types";

export type ShareButtonModelView = {
	shareData: ShareData;
	alternateVariant?: boolean;
};

export type ShareButtonModel = ReadonlyModel<ShareButtonModelView>;
