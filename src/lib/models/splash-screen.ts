import { ReadonlyModel } from "@mvc-react/mvc";

export type SplashScreenModelView = {
	isShown: boolean;
	exitedCallback?: () => void;
	isFullscreen?: boolean;
};

export type SplashScreenModel = ReadonlyModel<SplashScreenModelView>;
