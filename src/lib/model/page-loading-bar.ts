import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { LoadingBarModelView } from "./loading-bar";

export type PageLoadingBarModelView = LoadingBarModelView;

export type PageLoadingBarModelInteraction = InputModelInteraction<
	"SET_LOADING",
	{ value: boolean }
>;

export type PageLoadingBarModel = InteractiveModel<
	PageLoadingBarModelView,
	PageLoadingBarModelInteraction
>;
