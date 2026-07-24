import { ModeledContainerComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { EditorButtonModel } from "../../models/editor-button";

const EditorButton = function ({ model, children }) {
	const { modelView, interact } = model;
	const { isDisabled, isToggled, title } = modelView;

	return (
		<button
			type="button"
			title={title}
			className={`editor-button p-2 text-sm text-black disabled:opacity-50 disabled:backdrop-grayscale ${isToggled ? "bg-gray-900 text-white" : ""}`}
			disabled={isDisabled}
			onClick={() => interact({ type: "ACTION", input: { isToggled } })}
		>
			{children}
		</button>
	);
} satisfies ModeledContainerComponent<InitializedModel<EditorButtonModel>>;

export default EditorButton;
