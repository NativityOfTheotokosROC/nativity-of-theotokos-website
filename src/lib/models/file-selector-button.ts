import { InitializedModel, Model } from "@mvc-react/mvc";
import { ReactNode } from "react";
import { FileSelectorModel } from "./file-selector";

export type FileSelectorButtonModelView = {
	fileSelector: InitializedModel<FileSelectorModel>;
	contents: ReactNode;
	contentsWhenFile?: ReactNode;
};

export type FileSelectorButtonModel = Model<FileSelectorButtonModelView>;
