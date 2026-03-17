import { Metadata } from "next";
import NewsArticle from "./NewsArticle";
import {
	getAllArticles,
	getArticle,
	getArticleMetadata,
} from "@/src/lib/server-action/news-article";
import { newReadonlyModel } from "@mvc-react/mvc";
import { NewsArticle as NewsArticleType } from "@/src/lib/type/miscellaneous";
import { getBaseURL } from "@/src/lib/server-action/miscellaneous";
import { DynamicMarker } from "@/src/lib/component/miscellaneous/utility";
import { notFound } from "next/navigation";
import { connection } from "next/server";

function articleJsonLd(article: NewsArticleType) {
	const { title, author, articleImage, dateCreated, snippet } = article;
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description: snippet,
		datePublished: dateCreated,
		author: {
			"@type": "Person",
			name: author,
		},
		image: articleImage.source,
	};
}

export async function generateStaticParams() {
	const articles = await getAllArticles();
	return [{ article: "__placeholder__" }, ...articles];
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/news/[article]">): Promise<Metadata> {
	const { article } = await params;
	if (article == "__placeholder__") notFound();
	const { title, snippet, uri, articleImage } =
		await getArticleMetadata(article);

	return {
		title,
		description: snippet,
		// alternates: {
		// 	canonical: `/news/${uri}`,
		// 	languages: {
		// 		ru: `/ru/news/${uri}`,
		// 	},
		// },
		// openGraph: {
		// 	title,
		// 	description: snippet,
		// 	url: `/news/${uri}`,
		// 	type: "article",
		// 	images: [{ url: articleImage.source }],
		// },
		// twitter: {
		// 	card: "summary_large_image",
		// 	title,
		// 	description: snippet,
		// 	images: [{ url: articleImage.source }],
		// },
	};
}

export default async function Page({
	params,
}: PageProps<"/[locale]/news/[article]">) {
	await connection();
	const { article: articleId } = await params;
	const article = await getArticle(articleId);
	const baseUrl = await getBaseURL();
	const permalink = `${baseUrl}/news/${article.uri.toString()}`;
	const jsonLd = articleJsonLd(article);

	return (
		<>
			<DynamicMarker />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<NewsArticle model={newReadonlyModel({ article, permalink })} />
		</>
	);
}
