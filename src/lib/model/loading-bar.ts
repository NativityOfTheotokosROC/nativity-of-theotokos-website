import { Model } from "@mvc-react/mvc";

export interface LoadingBarModelView {
	isLoading: boolean;
}

export type LoadingBarModel = Model<LoadingBarModelView>;
