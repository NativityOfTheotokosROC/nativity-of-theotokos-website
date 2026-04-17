import { ReadonlyModel } from "@mvc-react/mvc";

export interface SplashScreenModelView {
	isShown: boolean;
	exitedCallback?: () => void;
	isFullscreen?: boolean;
}

export type SplashScreenModel = ReadonlyModel<SplashScreenModelView>;
