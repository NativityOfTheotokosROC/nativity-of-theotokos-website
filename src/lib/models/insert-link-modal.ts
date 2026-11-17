import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { getInsertLinkSchema } from "../validation/miscellaneous";
import z from "zod";

export type NewLink = z.infer<ReturnType<typeof getInsertLinkSchema>>;

export type InsertLinkModalModelView = {
	isOpen: boolean;
	initialLinkDetails?: Partial<{
		url: string;
		label: string;
	}>;
};

export type InsertLinkModalModelInteraction =
	| InputModelInteraction<
			"OPEN",
			{
				initialLinkDetails?: InsertLinkModalModelView["initialLinkDetails"];
			}
	  >
	| ModelInteraction<"CLOSE">
	| InputModelInteraction<"INSERT_LINK", NewLink>;

export type InsertLinkModalModel = InteractiveModel<
	InsertLinkModalModelView,
	InsertLinkModalModelInteraction
>;
