import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";

export type AutoCompleteBoxModelView<I, K extends string> = {
	id: K;
	isOpen?: boolean;
	query?: string;
	items: I[];
	transformer: (item: I) => string;
};

export type AutoCompleteBoxModelInteraction<K extends string> =
	| InputModelInteraction<"FILTER", { query: string }>
	| InputModelInteraction<"OPEN", { newId?: K }>
	| ModelInteraction<"CLOSE">
	| InputModelInteraction<"SELECT", { index: number }>;

export type AutoCompleteBoxModel<I, K extends string> = InteractiveModel<
	AutoCompleteBoxModelView<I, K>,
	AutoCompleteBoxModelInteraction<K>
>;
