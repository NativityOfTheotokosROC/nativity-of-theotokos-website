import { Model } from "@mvc-react/mvc";

export type ButtonBarModelView = {
	arrangement: "start" | "center" | "end" | "separated" | "spaced_around";
	orientation: "vertical" | "horizontal";
	className?: string;
};

export type ButtonBarModel = Model<ButtonBarModelView>;
