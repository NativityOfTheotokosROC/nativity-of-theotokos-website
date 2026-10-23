import { ReadonlyModel } from "@mvc-react/mvc";
import { Language } from "../utilities/types";

export type License = {
	text: string;
	subLicenseText?: string;
	website?: { link: string; linkLabel?: string };
	subLicenses?: License[];
};

export type AttributionModelView = {
	language: Language;
	licenses: License[];
};

export type AttributionModel = ReadonlyModel<AttributionModelView>;
