"use client";

import { useNewArticle } from "@/src/lib/model-implementations/new-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import NewArticle from "./NewArticle";

const NewArticleClient = function ({ model }) {
	const { author } = model.modelView;
	const newArticle = useNewArticle(author);

	return <NewArticle model={newArticle} />;
} satisfies ModeledVoidComponent<ReadonlyModel<{ author?: string }>>;

export default NewArticleClient;
