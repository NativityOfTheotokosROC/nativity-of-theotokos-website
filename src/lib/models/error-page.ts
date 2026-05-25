import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";

export type ErrorPageModelView = {
	message: string;
};

export type ErrorPageModelInteraction =
	| ModelInteraction<"RETRY">
	| InputModelInteraction<"REPORT_ERROR", { message: string }>;

export type ErrorPageModel = InteractiveModel<
	ErrorPageModelView,
	ErrorPageModelInteraction
>;
