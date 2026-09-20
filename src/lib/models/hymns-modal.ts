import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { Hymn } from "../utilities/types";

export type HymnsModalModelView = {
	isOpen: boolean;
	hymns: Hymn[];
};

export type HymnsModalModelInteraction =
	| InputModelInteraction<"OPEN", { hymns: Hymn[] }>
	| ModelInteraction<"CLOSE">;

export type HymnsModalModel = InteractiveModel<
	HymnsModalModelView,
	HymnsModalModelInteraction
>;
