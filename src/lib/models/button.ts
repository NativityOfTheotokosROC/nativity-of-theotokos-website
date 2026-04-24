import { ReadonlyModel } from "@mvc-react/mvc";

export type ButtonVariant = "standard" | "alternative";

export interface ButtonModelView {
	variant: ButtonVariant;
	action: () => void;
	disabled?: boolean;
	className?: string;
}

export type ButtonModel = ReadonlyModel<ButtonModelView>;
