import { ReadonlyModel } from "@mvc-react/mvc";

export interface TabModelView {
	name: string;
}

export type TabModel = ReadonlyModel<TabModelView>;
