import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	ArticlePreviewModalModelView,
	ArticlePreviewModalModelInteraction,
	ArticlePreviewModalModel,
} from "../models/article-preview-modal";

export function articlePreviewModalVIInterface(submitCallback: () => void) {
	return {
		async produceModelView(interaction, currentModelView) {
			const initErrorMessage = "The model is uninitialized";
			switch (interaction.type) {
				case "OPEN": {
					return {
						...interaction.input,
						isOpen: true,
					};
				}
				case "CLOSE": {
					if (!currentModelView) throw new Error(initErrorMessage);
					return { ...currentModelView, isOpen: false };
				}
				case "SUBMIT": {
					if (!currentModelView) throw new Error(initErrorMessage);
					submitCallback();
					return { ...currentModelView, isOpen: false };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		ArticlePreviewModalModelView,
		ArticlePreviewModalModelInteraction
	>;
}

export function useArticlePreviewModal(submitCallback: () => void) {
	const model = useNewStatefulInteractiveModel(
		articlePreviewModalVIInterface(submitCallback),
	);
	return model satisfies ArticlePreviewModalModel;
}
