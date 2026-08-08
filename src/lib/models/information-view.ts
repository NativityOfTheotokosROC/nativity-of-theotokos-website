import { Model } from "@mvc-react/mvc";
import { FC, SVGProps } from "react";

export type InformationViewModelView = {
	graphic: FC<SVGProps<SVGElement>>;
	mainMessage: string;
	detailedMessage: string;
};

export type InformationViewModel = Model<InformationViewModelView>;
