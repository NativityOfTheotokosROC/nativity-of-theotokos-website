import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export interface LoadingBarModelView {
	isLoading: boolean;
}

export type LoadingBarModelInteraction = InputModelInteraction<
	"SET_LOADING",
	{ value: boolean }
>;

export type LoadingBarModel = InteractiveModel<
	LoadingBarModelView,
	LoadingBarModelInteraction
>;
