import { ReadonlyModel } from "@mvc-react/mvc";

export interface SpinnerModelView {
	color: string;
	size: number;
}

export type SpinnerModel = ReadonlyModel<SpinnerModelView>;
