import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { AutoCompleteBoxModel } from "../../models/auto-complete-box";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import "./auto-complete-box.css";

const AutoCompleteBox = function ({ model }) {
	const { modelView, interact } = model;
	const { id, items, query, isOpen } = modelView;
	const queryParts = query.split(/\s+/).map(part => part.toLowerCase());
	const filteredItems = items.filter(item => {
		const lowercasedItem = item.toLowerCase();
		return queryParts.every(part => lowercasedItem.includes(part));
	});
	const computedOpen = filteredItems.length > 0 && isOpen;
	const [isClickable, setClickable] = useState(computedOpen); //TODO: Not ideal

	return (
		<Tooltip
			id={id}
			className="auto-complete-box"
			isOpen={computedOpen}
			clickable={isClickable}
			afterHide={() => setClickable(false)}
			afterShow={() => setClickable(true)}
			place="bottom-start"
			content={
				<div className="auto-complete-items flex max-h-[9em] w-[17em] max-w-[17em] flex-col overflow-y-auto pr-3 text-sm">
					{filteredItems.map(item => (
						<button
							key={`${item}`}
							onClick={async () => {
								await interact({
									type: "SELECT",
									input: { value: item },
								});
							}}
							className="bg-transparent p-3 text-left hover:text-[#ffdc4f] active:text-[#ffdc4f]"
						>
							{item}
						</button>
					))}
				</div>
			}
		/>
	);
} satisfies ModeledVoidComponent<InitializedModel<AutoCompleteBoxModel>>;

export default AutoCompleteBox;
