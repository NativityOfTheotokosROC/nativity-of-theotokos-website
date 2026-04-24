import { ReadonlyModel } from "@mvc-react/mvc";
import { Image } from "../types/general";

export type Commemoration = {
	title: string;
	feastDays: string;
	icon?: Pick<Image, "source" | "about"> &
		Partial<Pick<Image, "placeholder">>;
	body: string;
	id: string;
};

export interface CommemorationModelView {
	commemoration: Commemoration;
	permalink: string;
}

export type CommemorationModel = ReadonlyModel<CommemorationModelView>;
