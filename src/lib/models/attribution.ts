import { ReadonlyModel } from "@mvc-react/mvc";
import { Language } from "../types/general";

export type AttributionModelView = {
	language: Language;
	licenses: { text: string; link: string; linkLabel: string }[];
};

export type AttributionModel = ReadonlyModel<AttributionModelView>;
