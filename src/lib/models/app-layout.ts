import { ReadonlyModel } from "@mvc-react/mvc";
import { Language } from "../types/general";

export type AppLayoutModelView = {
	language: Language;
};

export type AppLayoutModel = ReadonlyModel<AppLayoutModelView>;
