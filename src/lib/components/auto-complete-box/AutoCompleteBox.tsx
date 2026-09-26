import { InitializedModel } from "@mvc-react/mvc";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { AutoCompleteBoxModel } from "../../models/auto-complete-box";
import "./auto-complete-box.css";

export default function AutoCompleteBox<I, K extends string>({
	model,
}: {
	model: InitializedModel<AutoCompleteBoxModel<I, K>>;
}) {
	const { modelView, interact } = model;
	const { id, items, query, isOpen, transformer } = modelView;
	const filteredItems = items
		.map((item, arrayIndex) => ({ item, arrayIndex }))
		.filter(({ item }) => {
			const lowercasedItem = transformer(item).toLowerCase();
			const queryParts =
				query?.split(/\s+/).map(part => part.toLowerCase()) ?? [];
			return queryParts.every(part => lowercasedItem.includes(part));
		});
	const computedOpen = (isOpen && filteredItems.length > 0) ?? false;
	const [isClickable, setClickable] = useState(computedOpen); //TODO: Not ideal
	const [lastVisibleItems, setLastVisibleItems] = useState(filteredItems);
	const displayedItems = computedOpen ? filteredItems : lastVisibleItems;
	
	if (
		computedOpen &&
		JSON.stringify(filteredItems) !== JSON.stringify(lastVisibleItems)
	) {
		setLastVisibleItems(filteredItems);
	}

	return (
		<Tooltip
			className="auto-complete-box bg-gray-950"
			anchorSelect={`#${id}`}
			key={id}
			isOpen={computedOpen}
			clickable={isClickable}
			afterHide={() => setClickable(false)}
			afterShow={() => setClickable(true)}
			place="bottom-start"
			content={
				<div className="auto-complete-items flex max-h-[9em] w-[17em] max-w-[17em] flex-col overflow-y-auto pr-3 text-sm">
					{displayedItems.map(({ item, arrayIndex }) => (
						<button
							type="button"
							key={`${arrayIndex}`}
							onClick={() =>
								interact({
									type: "SELECT",
									input: { index: arrayIndex },
								})
							}
							className="bg-transparent p-3 text-left hover:text-[#ffdc4f] active:text-[#ffdc4f]"
						>
							{transformer(item)}
						</button>
					))}
				</div>
			}
		/>
	);
}
