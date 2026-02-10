import { Metadata } from "next";
import NewsArticle from "./NewsArticle";
import { getArticle } from "@/src/lib/server-action/news-article";
import { newReadonlyModel } from "@mvc-react/mvc";

export async function generateMetadata({
	params,
}: {
	params: { locale: string; article: string };
}): Promise<Metadata> {
	const { article } = await params;
	const { title } = await getArticle(article);

	return {
		title,
	};
}

export default async function Page({
	params,
}: {
	params: { article: string };
}) {
	const { article: articleId } = await params;
	const article = await getArticle(articleId);

	return <NewsArticle model={newReadonlyModel({ article })} />;
}
