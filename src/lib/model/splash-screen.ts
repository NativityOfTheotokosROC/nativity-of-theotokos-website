import { ReadonlyModel } from "@mvc-react/mvc";

export interface SplashScreenModelView {
	isShown: boolean;
	exitedCallback?: () => void;
}

export type SplashScreenModel = ReadonlyModel<SplashScreenModelView>;
