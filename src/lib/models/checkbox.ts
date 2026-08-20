import { Model } from "@mvc-react/mvc";

export type CheckboxModelView = {
	isChecked: boolean;
	label: string;
	checkedChangeCallback?: (value: boolean) => void;
	options?: Partial<{
		className: string;
		checkboxClassName: string;
		checkClassName: string;
		labelClassName: string;
	}>;
};

export type CheckboxModel = Model<CheckboxModelView>;
