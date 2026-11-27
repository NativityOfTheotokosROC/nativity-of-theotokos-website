import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	ArticleAuthorModalModelInteraction,
	ArticleAuthorModalModelView,
} from "../models/article-author-modal";
import { UninitializedModelError } from "../utilities/errors";
import { ArticleAuthor, Translation } from "../utilities/types";
import { NewArticleAuthor } from "../validation/article";

export function articleAuthorModalVIInterface(
	addAuthorCallback: (
		author: NewArticleAuthor,
		id?: number,
		successCallback?: (author: ArticleAuthor<Translation>) => void,
	) => Promise<void>,
	deleteProfileCallback: (
		id: number,
		successCallback?: () => void,
	) => Promise<void>,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "OPEN": {
					const input =
						"input" in interaction ? interaction.input : null;
					return {
						isOpen: true,
						author: input?.author,
					};
				}
				case "CLOSE": {
					if (!currentModelView) throw new UninitializedModelError();
					return {
						...currentModelView,
						isOpen: false,
					};
				}
				case "ADD_AUTHOR": {
					if (!currentModelView) throw new UninitializedModelError();
					const { author, id, successCallback } = interaction.input;
					await addAuthorCallback(author, id, successCallback);
					return { ...currentModelView, isOpen: false };
				}
				case "DELETE_PROFILE": {
					if (!currentModelView) throw new UninitializedModelError();
					const { id, successCallback } = interaction.input;
					await deleteProfileCallback(id, successCallback);
					return { ...currentModelView, isOpen: false };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		ArticleAuthorModalModelView,
		ArticleAuthorModalModelInteraction
	>;
}

export function useArticleAuthorModal({
	addAuthorCallback,
	deleteProfileCallback,
}: {
	addAuthorCallback: (
		author: NewArticleAuthor,
		id?: number,
		successCallback?: (author: ArticleAuthor<Translation>) => void,
	) => Promise<void>;
	deleteProfileCallback: (
		id: number,
		successCallback?: () => void,
	) => Promise<void>;
}) {
	const model = useNewStatefulInteractiveModel(
		articleAuthorModalVIInterface(addAuthorCallback, deleteProfileCallback),
	);
	return model;
}
