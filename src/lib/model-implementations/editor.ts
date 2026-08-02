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
	updateCallback?: (content: string) => void | Promise<void>,
) {
	return {
		produceModelView: async function (
			interaction: EditorModelInteraction,
		): Promise<EditorModelView> {
			switch (interaction.type) {
				case "UPDATE_EDITOR": {
					await updateCallback?.(interaction.input.content);
					return { content: interaction.input.content };
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
	updateCallback?: (content: string) => void | Promise<void>,
) {
	const model = useInitializedStatefulInteractiveModel(
		editorVIInterface(updateCallback),
		{
			content: initialContent,
		},
	);
	return model satisfies InitializedModel<EditorModel>;
}
