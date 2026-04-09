import { routing } from "@/src/i18n/routing";
import { getBaseURL } from "@/src/lib/server-action/miscellaneous";
import {
	getArticle,
	getArticleMetadata,
} from "@/src/lib/server-action/news-article";
import { NewsArticle as NewsArticleType } from "@/src/lib/type/general";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import NewsArticle from "./NewsArticle";

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
	return [{ article: "__placeholder__" }];
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/news/[article]">): Promise<Metadata> {
	"use cache";

	const { article, locale } = await params;
	const computedLocale = hasLocale(routing.locales, locale) ? locale : "en";
	if (article == "__placeholder__") notFound();
	const { title, snippet, uri, articleImage } = await getArticleMetadata(
		article,
		computedLocale,
	);

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
			images: [{ url: articleImage.source }],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: snippet,
			images: [{ url: articleImage.source }],
		},
	};
}

export default async function Page({
	params,
}: PageProps<"/[locale]/news/[article]">) {
	"use cache";

	const { article: articleId, locale } = await params;
	const computedLocale = hasLocale(routing.locales, locale) ? locale : "en";

	//TODO: Investigate why locale is not updating server-side
	const article = await getArticle(articleId, computedLocale);
	const baseUrl = await getBaseURL();
	const permalink = `${baseUrl}/news/${article.uri.toString()}`;
	const jsonLd = articleJsonLd(article);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<NewsArticle model={newReadonlyModel({ article, permalink })} />
		</>
	);
}
