import { ReadonlyModel } from "@mvc-react/mvc";
import { Language } from "../utilities/types";

export type AttributionModelView = {
	language: Language;
	licenses: { text: string; link: string; linkLabel: string }[];
};

export type AttributionModel = ReadonlyModel<AttributionModelView>;
