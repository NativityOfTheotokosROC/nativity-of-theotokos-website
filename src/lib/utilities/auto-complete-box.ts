import { InitializedModel } from "@mvc-react/mvc";
import { AutoCompleteBoxModel } from "../models/auto-complete-box";

export function autoCompleteFields<I>(
	autoCompleteBox: InitializedModel<AutoCompleteBoxModel<I>>,
) {
	return {
		autoComplete: "off" as const,
		dataTooltipId: autoCompleteBox.modelView.id,
		async onChange(query: string) {
			await autoCompleteBox.interact({
				type: "TOGGLE",
				input: {
					value: !(query.trim() === ""),
				},
			});
			await autoCompleteBox.interact({
				type: "FILTER",
				input: {
					query,
				},
			});
		},
		async onBlur() {
			await autoCompleteBox.interact({
				type: "TOGGLE",
				input: {
					value: false,
				},
			});
		},
	};
}
