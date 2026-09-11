import { InitializedModel } from "@mvc-react/mvc";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { AutoCompleteBoxModel } from "../../models/auto-complete-box";
import "./auto-complete-box.css";

export default function AutoCompleteBox<I>({
	model,
}: {
	model: InitializedModel<AutoCompleteBoxModel<I>>;
}) {
	const { modelView, interact } = model;
	const { id, items, query, isOpen, transformer } = modelView;
	const queryParts =
		query?.split(/\s+/).map(part => part.toLowerCase()) ?? [];
	const filteredItems = items
		.map((item, arrayIndex) => ({ item, arrayIndex }))
		.filter(({ item }) => {
			const lowercasedItem = transformer(item).toLowerCase();
			return queryParts.every(part => lowercasedItem.includes(part));
		});
	const computedOpen = (isOpen && filteredItems.length > 0) ?? false;
	const [isClickable, setClickable] = useState(computedOpen); //TODO: Not ideal
	// DONE: Modify so transition out of vis maintains previous list of items for better UX
	const [lastVisibleItems, setLastVisibleItems] = useState(filteredItems);
	const displayedItems = computedOpen ? filteredItems : lastVisibleItems;

	useEffect(() => {
		if (computedOpen) {
			setLastVisibleItems(filteredItems);
		}
	}, [computedOpen, JSON.stringify(filteredItems)]);

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
					{displayedItems.map(({ item, arrayIndex }) => (
						<button
							key={`${arrayIndex}`}
							onClick={async () => {
								await interact({
									type: "SELECT",
									input: { index: arrayIndex },
								});
							}}
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
