import { InitializedInteractiveModel, ModelInteraction } from "@mvc-react/mvc";

export interface LoginTooltipModelView {
	isOpen: boolean;
	text: string;
}

export type LoginTooltipModelInteraction = ModelInteraction<"TRIGGER">;

export type LoginTooltipModel = InitializedInteractiveModel<
	LoginTooltipModelView,
	LoginTooltipModelInteraction
>;
