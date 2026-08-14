import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	ArticlePreviewModalModelView,
	ArticlePreviewModalModelInteraction,
	ArticlePreviewModalModel,
} from "../models/article-preview-modal";

export function articlePreviewModalVIInterface(
	submitCallback: () => Promise<void>,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			const initErrorMessage = "The model is uninitialized";
			switch (interaction.type) {
				case "OPEN": {
					const {
						title,
						body,
						authorName,
						dateCreated,
						snippet,
						image,
					} = interaction.input;
					return {
						isOpen: true,
						title,
						body,
						authorName,
						dateCreated,
						snippet,
						image,
					};
				}
				case "CLOSE": {
					if (!currentModelView) throw new Error(initErrorMessage);
					return { ...currentModelView, isOpen: false };
				}
				case "SUBMIT": {
					if (!currentModelView) throw new Error(initErrorMessage);
					await submitCallback();
					return { ...currentModelView, isOpen: false };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		ArticlePreviewModalModelView,
		ArticlePreviewModalModelInteraction
	>;
}

export function useArticlePreviewModal(submitCallback: () => Promise<void>) {
	const model = useNewStatefulInteractiveModel(
		articlePreviewModalVIInterface(submitCallback),
	);
	return model satisfies ArticlePreviewModalModel;
}
