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

function editorVIInterface() {
	return {
		produceModelView: async function (
			interaction: EditorModelInteraction,
		): Promise<EditorModelView> {
			switch (interaction.type) {
				case "UPDATE_EDITOR": {
					return { content: interaction.input.content };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		EditorModelView,
		EditorModelInteraction
	>;
}

export function useEditor(initialContent: string) {
	const model = useInitializedStatefulInteractiveModel(editorVIInterface(), {
		content: initialContent,
	});
	return model satisfies InitializedModel<EditorModel>;
}
