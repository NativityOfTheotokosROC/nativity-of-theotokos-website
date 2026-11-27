import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	ArticleAuthorModelView,
	ArticleAuthorModelInteraction,
} from "../models/article-author";
import { ToastNotifierModel, useToastNotifier } from "./notifier";
import {
	addArticleAuthor,
	deleteAuthorProfile,
	updateArticleAuthor,
} from "../server-actions/article";
import { ArticleAuthor, Translation, Translator } from "../utilities/types";
import { DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER } from "../utilities/constants";
import { UninitializedModelError } from "../utilities/errors";
import { useTranslations } from "next-intl";

export function articleAuthorVIInterface({
	notification,
}: {
	notification?: {
		notifier: ToastNotifierModel;
		t: Translator;
	};
}) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "ADD_AUTHOR": {
					const { id, author, successCallback } = interaction.input;
					try {
						const submittedAuthor =
							id === undefined
								? await addArticleAuthor(author)
								: await updateArticleAuthor(id, author);
						await notification?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notification.t(
										id
											? "articleAuthor.updateSuccessMessage"
											: "articleAuthor.addSuccessMessage",
									),
								},
							},
						});
						const { name, email, profile } = author;
						const newAuthor = {
							id: submittedAuthor.id,
							uri: submittedAuthor.uri,
							name,
							email,
							profile: profile
								? {
										...profile,
										description: profile.description.english
											? {
													english:
														profile.description
															.english,
													russian:
														profile.description
															.russian ??
														undefined,
												}
											: undefined,
										picture: profile.picture
											? {
													source: profile.picture,
													placeholder:
														DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER,
												}
											: undefined,
										contactEmail:
											profile.contactEmail ?? undefined,
									}
								: undefined,
						} satisfies ArticleAuthor<Translation>;
						successCallback?.(newAuthor);
						return {
							author: newAuthor,
						};
					} catch (error) {
						await notification?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: notification.t(
										id
											? "articleAuthor.updateFailureMessage"
											: "articleAuthor.addFailureMessage",
										{ message: JSON.stringify(error) },
									),
								},
							},
						});
						throw error;
					}
				}
				case "DELETE_PROFILE": {
					if (!currentModelView) throw new UninitializedModelError();
					const { id, successCallback } = interaction.input;
					try {
						await deleteAuthorProfile(id);
						await notification?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notification.t(
										"articleAuthor.deleteProfile",
									),
								},
							},
						});
						successCallback?.();
						return {
							...currentModelView,
							author: currentModelView.author
								? {
										...currentModelView.author,
										profile: undefined,
									}
								: undefined,
						};
					} catch (error) {
						await notification?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: notification.t(
										"articleAuthor.deleteFailureMessage",
										{ message: JSON.stringify(error) },
									),
								},
							},
						});
						throw error;
					}
				}
			}
		},
	} satisfies ViewInteractionInterface<
		ArticleAuthorModelView,
		ArticleAuthorModelInteraction
	>;
}

export function useArticleAuthor({
	initialModelView,
	notifier,
}: {
	initialModelView: ArticleAuthorModelView;
	notifier?: ToastNotifierModel | "default";
}) {
	const t = useTranslations();
	const defaultNotifier = useToastNotifier();
	const finalNotifier = notifier !== "default" ? notifier : defaultNotifier;
	return useInitializedStatefulInteractiveModel(
		articleAuthorVIInterface({
			notification: finalNotifier && { notifier: finalNotifier, t },
		}),
		initialModelView,
	);
}
