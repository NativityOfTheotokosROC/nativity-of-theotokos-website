"use client";

import { useArticleAuthor } from "@/src/lib/model-implementations/article-author";
import { useToastNotifier } from "@/src/lib/model-implementations/notifier";
import {
	ArticleAuthor as ArticleAuthorType,
	Translation,
} from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import ArticleAuthor from "./ArticleAuthor";
import PageView from "../../page-view/PageView";
import { useTranslations } from "next-intl";

const ArticleAuthorClient = function ({ model }) {
	const { author } = model.modelView;
	const t = useTranslations("articleAuthor");
	const notifier = useToastNotifier();
	const articleAuthor = useArticleAuthor({
		initialModelView: { author },
		notifier,
	});

	return (
		<PageView model={newReadonlyModel({ title: t("title") })}>
			<ArticleAuthor model={articleAuthor} />
		</PageView>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{ author?: ArticleAuthorType<Translation> }>
>;

export default ArticleAuthorClient;
