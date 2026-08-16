import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	FileSelectorButtonModel,
	FileSelectorButtonModelInteraction,
	FileSelectorButtonModelView,
	FileType,
} from "../models/file-selector-button";

function fileSelectorButtonVIInterface(
	selectCallback?: (file: File) => Promise<void>,
) {
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
		FileSelectorButtonModelView,
		FileSelectorButtonModelInteraction
	>;
}

export function useFileSelectorButton(
	options?: Partial<{
		type: FileType;
		selectCallback: (file: File) => Promise<void>;
	}>,
) {
	const model = useInitializedStatefulInteractiveModel(
		fileSelectorButtonVIInterface(options?.selectCallback),
		{
			file: null,
			type: options?.type,
		},
	);

	return model;
}
