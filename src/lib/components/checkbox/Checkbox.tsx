import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { CheckboxModel } from "../../models/checkbox";
import {
	Field,
	Label,
	Checkbox as HeadlessUICheckbox,
} from "@headlessui/react";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

const Checkbox = function ({ model }) {
	const { isChecked, checkedChangeCallback, label, options } =
		model.modelView;

	return (
		<Field
			className={twMerge("flex items-center gap-3", options?.className)}
		>
			<HeadlessUICheckbox
				className={twMerge(
					`group flex size-6 items-center justify-center rounded border border-gray-400 bg-white data-checked:bg-gray-900`,
					options?.checkboxClassName,
				)}
				onChange={checkedChangeCallback}
				checked={isChecked}
			>
				<Check
					className={twMerge(
						"hidden size-4 stroke-white group-data-checked:block",
						options?.checkClassName,
					)}
				/>
			</HeadlessUICheckbox>
			<Label className={options?.labelClassName}>{label}</Label>
		</Field>
	);
} satisfies ModeledVoidComponent<InitializedModel<CheckboxModel>>;

export default Checkbox;
