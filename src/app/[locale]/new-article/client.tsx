"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";

const NewArticleClient = function ({ model }) {
	const { author } = model.modelView;
	const t = useTranslations("newArticle");

	return <div className=""></div>;
} satisfies ModeledVoidComponent<ReadonlyModel<{ author?: string | null }>>;

export default NewArticleClient;
