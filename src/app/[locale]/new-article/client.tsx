"use client";

import { useNewArticle } from "@/src/lib/model-implementations/new-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import NewArticle from "./NewArticle";
import { NewArticleModelView } from "@/src/lib/models/new-article";

const NewArticleClient = function ({ model }) {
	const { ticketId, initialTitle, initialBody, author } = model.modelView;
	const newArticle = useNewArticle(ticketId, {
		initialTitle,
		initialBody,
		author,
	});

	return <NewArticle model={newArticle} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<
		Pick<
			NewArticleModelView,
			"ticketId" | "author" | "initialTitle" | "initialBody"
		>
	>
>;

export default NewArticleClient;
