import { Model } from "@mvc-react/mvc";
import { FC, SVGProps } from "react";

export type InformationViewModelView = {
	Graphic: FC<SVGProps<SVGElement>>;
	mainMessage: string;
	detailedMessage: string;
};

export type InformationViewModel = Model<InformationViewModelView>;
