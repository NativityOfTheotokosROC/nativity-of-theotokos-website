import { InitializedModel } from "@mvc-react/mvc";
import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	EditorModel,
	EditorModelInteraction,
	EditorModelView,
} from "../models/editor";

function editorVIInterface(
	options?: Partial<{
		updateCallback: (content: string) => Promise<void>;
		className: string;
	}>,
) {
	return {
		async produceModelView(
			interaction,
			currentModelView,
		): Promise<EditorModelView> {
			switch (interaction.type) {
				case "UPDATE_EDITOR": {
					await options?.updateCallback?.(interaction.input.content);
					return {
						content: interaction.input.content,
						className: options?.className,
					};
				}
				case "TOGGLE_READONLY": {
					if (!currentModelView)
						throw new Error("The model is not initialized");
					return {
						...currentModelView,
						isReadonly: interaction.input.value,
					};
				}
			}
		},
	} satisfies ViewInteractionInterface<
		EditorModelView,
		EditorModelInteraction
	>;
}

export function useEditor(
	initialContent: string,
	options?: Partial<{
		updateCallback: (content: string) => Promise<void>;
		className: string;
	}>,
) {
	const model = useInitializedStatefulInteractiveModel(
		editorVIInterface(options),
		{
			content: initialContent,
			className: options?.className,
		},
	);
	return model satisfies InitializedModel<EditorModel>;
}
