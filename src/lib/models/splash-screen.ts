import { ReadonlyModel } from "@mvc-react/mvc";

export type SplashScreenModelView = {
	isShown: boolean;
	exitedCallback?: () => void;
};

export type SplashScreenModel = ReadonlyModel<SplashScreenModelView>;
