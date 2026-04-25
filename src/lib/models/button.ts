import { ReadonlyModel } from "@mvc-react/mvc";

export type ButtonVariant = "standard" | "alternative";
export type ButtonType = "button" | "submit" | "reset";

export interface ButtonModelView {
	action: () => void;
	variant?: ButtonVariant;
	disabled?: boolean;
	className?: string;
	type?: ButtonType;
}

export type ButtonModel = ReadonlyModel<ButtonModelView>;
