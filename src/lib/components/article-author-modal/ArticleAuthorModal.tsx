import { ModeledVoidComponent } from "@mvc-react/components";
import { ArticleAuthorModalModel } from "../../models/article-author-modal";
import { newReadonlyModel } from "@mvc-react/mvc";
import Modal from "../modal/Modal";
import ArticleAuthor from "../views/article-author/ArticleAuthor";
import { useTranslations } from "next-intl";

const ArticleAuthorModal = function ({ model }) {
	const { modelView, interact } = model;
	const t = useTranslations("articleAuthor");

	return (
		<Modal
			model={newReadonlyModel({
				isOpen: modelView?.isOpen ?? false,
				onClose: () => interact({ type: "CLOSE" }),
				size: "small",
				title: t("title"),
				variant: "titled-with-close",
			})}
		>
			<div className="flex w-full flex-col items-center justify-center">
				<div className="w-full p-6">
					<ArticleAuthor
						model={{
							modelView: {
								author: modelView?.author,
							},
							async interact(interaction) {
								switch (interaction.type) {
									case "ADD_AUTHOR": {
										const { author, id } =
											interaction.input;
										await interact({
											type: "ADD_AUTHOR",
											input: {
												author,
												id,
											},
										});
										await interact({ type: "CLOSE" });
										break;
									}
									case "DELETE_PROFILE": {
										await interact({
											type: "DELETE_PROFILE",
											input: { id: interaction.input.id },
										});
										break;
									}
									default: {
										interaction satisfies never;
									}
								}
							},
						}}
					/>
				</div>
			</div>
		</Modal>
	);
} satisfies ModeledVoidComponent<ArticleAuthorModalModel>;

export default ArticleAuthorModal;
