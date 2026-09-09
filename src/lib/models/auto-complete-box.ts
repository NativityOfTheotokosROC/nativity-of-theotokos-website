import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type AutoCompleteBoxModelView<I> = {
	id: string;
	isOpen?: boolean;
	query?: string;
	items: I[];
	transformer: (item: I) => string;
};

export type AutoCompleteBoxModelInteraction<I> =
	| InputModelInteraction<"FILTER", { query: string }>
	| InputModelInteraction<"TOGGLE", { value: boolean }>
	| InputModelInteraction<"SELECT", { index: number }>;

export type AutoCompleteBoxModel<I = unknown> = InteractiveModel<
	AutoCompleteBoxModelView<I>,
	AutoCompleteBoxModelInteraction<I>
>;
