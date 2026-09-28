import { InitializedModel } from "@mvc-react/mvc";
import { RadioGroupModel } from "../../models/radio-group";
import {
	Field,
	RadioGroup as HeadlessUIRadioGroup,
	Label,
	Radio,
} from "@headlessui/react";
import { ModeledVoidComponent } from "@mvc-react/components";
import { twMerge } from "tailwind-merge";

const RadioGroup = function ({ model }) {
	const { selected, items, options, selectedChangedCallback } =
		model.modelView;

	return (
		<HeadlessUIRadioGroup
			value={selected}
			onChange={selectedChangedCallback}
			className={twMerge(
				"flex gap-3",
				options?.orientation === "horizontal"
					? "flex-row"
					: options?.orientation === "vertical"
						? "flex-col"
						: undefined,
				options?.className,
			)}
		>
			{items.map(item => (
				<Field key={item.id} className={"flex items-center gap-3"}>
					<Radio
						value={item}
						className="group flex size-4 max-h-6 max-w-6 items-center justify-center rounded-full border border-gray-400 bg-white transition duration-200 ease-out group-data-checked:border-2 group-data-checked:border-gray-800"
					>
						<div className="invisible size-2 rounded-full bg-gray-800 transition duration-200 ease-out group-data-checked:visible" />
					</Radio>
					<Label>{item.text}</Label>
				</Field>
			))}
		</HeadlessUIRadioGroup>
	);
} satisfies ModeledVoidComponent<InitializedModel<RadioGroupModel>>;

export default RadioGroup;
