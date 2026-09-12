import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	FileSelectorModel,
	FileSelectorModelInteraction,
	FileSelectorModelView,
	FileType,
} from "../models/file-selector";

function fileSelectorVIInterface(selectCallback?: (file: File) => void) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "SELECT_FILE": {
					selectCallback?.(interaction.input.file);
					return currentModelView
						? {
								...currentModelView,
								file: interaction.input.file,
							}
						: { file: interaction.input.file };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		FileSelectorModelView,
		FileSelectorModelInteraction
	>;
}

export function useFileSelector(
	options?: Partial<{
		type: FileType;
		selectCallback: (file: File) => void;
	}>,
) {
	const model = useInitializedStatefulInteractiveModel(
		fileSelectorVIInterface(options?.selectCallback),
		{
			file: null,
			type: options?.type,
		},
	);

	return model;
}
