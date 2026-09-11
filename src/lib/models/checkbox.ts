import { Model } from "@mvc-react/mvc";
import { Options } from "../types/general";

export type CheckboxModelView = {
	isChecked: boolean;
	label: string;
	checkedChangeCallback?: (value: boolean) => void;
} & Options<{
	labelPosition: "left" | "right" | "top" | "bottom";
	className: string;
	checkboxClassName: string;
	checkClassName: string;
	labelClassName: string;
}>;

export type CheckboxModel = Model<CheckboxModelView>;
