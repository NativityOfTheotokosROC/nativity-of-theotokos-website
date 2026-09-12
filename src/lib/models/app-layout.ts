import { ReadonlyModel } from "@mvc-react/mvc";
import { Language } from "../utilities/types";

export type AppLayoutModelView = {
	language: Language;
};

export type AppLayoutModel = ReadonlyModel<AppLayoutModelView>;
