"use client";

import { useArticleAuthor } from "@/src/lib/model-implementations/article-author";
import { useToastNotifier } from "@/src/lib/model-implementations/notifier";
import {
	ArticleAuthor as ArticleAuthorType,
	Translation,
} from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import ArticleAuthor from "./ArticleAuthor";

const ArticleAuthorClient = function ({ model }) {
	const { author } = model.modelView;
	const notifier = useToastNotifier();
	const articleAuthor = useArticleAuthor({
		initialModelView: { author },
		notifier,
	});

	return <ArticleAuthor model={articleAuthor} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<{ author?: ArticleAuthorType<Translation> }>
>;

export default ArticleAuthorClient;
