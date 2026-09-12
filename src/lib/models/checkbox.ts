import { Model } from "@mvc-react/mvc";
import { Options } from "../utilities/types";

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
