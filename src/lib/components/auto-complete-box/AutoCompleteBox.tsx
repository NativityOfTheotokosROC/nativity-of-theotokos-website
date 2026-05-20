import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { AutoCompleteBoxModel } from "../../models/auto-complete-box";
import { Tooltip } from "react-tooltip";

const AutoCompleteBox = function ({ model }) {
	const { modelView, interact } = model;
	const { id, items, query, isOpen } = modelView;
	const filteredItems = items.filter(item => item.includes(query));
	const computedOpen = filteredItems.length > 0 && isOpen;

	return (
		<Tooltip
			id={id}
			className="auto-complete-box"
			isOpen={computedOpen}
			clickable
			place="bottom-start"
		>
			<div className="auto-complete-items flex max-h-[8em] w-[17em] max-w-[17em] flex-col overflow-y-auto pr-3 text-sm">
				{filteredItems.map(item => (
					<button
						key={`${item}`}
						onClick={() =>
							interact({ type: "SELECT", input: { value: item } })
						}
						className="bg-transparent p-3 text-left active:bg-black active:text-[#ffdc4f]"
					>
						{item}
					</button>
				))}
			</div>
		</Tooltip>
	);
} satisfies ModeledVoidComponent<InitializedModel<AutoCompleteBoxModel>>;

export default AutoCompleteBox;
