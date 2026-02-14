import { Metadata } from "next";
import NewsArticle from "./NewsArticle";
import { getArticle } from "@/src/lib/server-action/news-article";
import { newReadonlyModel } from "@mvc-react/mvc";
import { NewsArticle as NewsArticleType } from "@/src/lib/type/miscellaneous";

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
		image: articleImage,
	};
}

export async function generateMetadata({
	params,
}: {
	params: { locale: string; article: string };
}): Promise<Metadata> {
	const { article } = await params;
	const { title, snippet, uri, articleImage } = await getArticle(article);

	return {
		title,
		description: snippet,
		alternates: {
			canonical: `/news/${uri}`,
			languages: {
				ru: `/ru/news/${uri}`,
			},
		},
		openGraph: {
			title,
			description: snippet,
			url: `/news/${uri}`,
			type: "article",
			images: [articleImage.source],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: snippet,
			images: [articleImage.source],
		},
	};
}

export default async function Page({
	params,
}: {
	params: { article: string };
}) {
	const { article: articleId } = await params;
	const article = await getArticle(articleId);
	const jsonLd = articleJsonLd(article);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<NewsArticle model={newReadonlyModel({ article })} />
		</>
	);
}
