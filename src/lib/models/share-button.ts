import { ReadonlyModel } from "@mvc-react/mvc";
import { ShareData } from "../types/general";

export interface ShareButtonModelView {
	shareData: ShareData;
}

export type ShareButtonModel = ReadonlyModel<ShareButtonModelView>;
