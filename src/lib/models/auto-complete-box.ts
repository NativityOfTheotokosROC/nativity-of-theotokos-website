import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type AutoCompleteBoxModelView = {
	id: string;
	isOpen: boolean;
	query: string;
	items: string[];
	selectCallback: (value: string, index: number) => void;
};

export type AutoCompleteBoxModelInteraction =
	| InputModelInteraction<"FILTER", { query: string }>
	| InputModelInteraction<"TOGGLE", { value: "open" | "close" }>
	| InputModelInteraction<"SELECT", { value: string; index: number }>;

export type AutoCompleteBoxModel = InteractiveModel<
	AutoCompleteBoxModelView,
	AutoCompleteBoxModelInteraction
>;
