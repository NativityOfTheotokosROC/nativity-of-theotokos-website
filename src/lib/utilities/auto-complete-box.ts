import { InitializedModel } from "@mvc-react/mvc";
import { AutoCompleteBoxModel } from "../models/auto-complete-box";

export function autoCompleteFields<I, K extends string>(
	autoCompleteBox: InitializedModel<AutoCompleteBoxModel<I, K>>,
) {
	return {
		autoComplete: "off" as const,
		dataTooltipId: autoCompleteBox.modelView.id,
		async onChange(query: string, id?: K) {
			query.trim() === ""
				? await autoCompleteBox.interact({
						type: "CLOSE",
					})
				: await autoCompleteBox.interact({
						type: "OPEN",
						input: { newId: id },
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
				type: "CLOSE",
			});
		},
	};
}
