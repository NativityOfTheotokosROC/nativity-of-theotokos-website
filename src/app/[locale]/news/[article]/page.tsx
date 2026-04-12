import { routing } from "@/src/i18n/routing";
import {
	getAllArticles,
	getArticle,
	getArticleMetadata,
} from "@/src/lib/server-action/news-article";
import { NewsArticle as NewsArticleType } from "@/src/lib/type/general";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import NewsArticle from "./NewsArticle";
import { BASE_URL } from "@/src/lib/utility/server-constant";

export async function generateStaticParams() {
	const [articlesEn, articlesRu] = await Promise.all([
		getAllArticles("en"),
		getAllArticles("ru"),
	]);
	return [
		...articlesEn.map(article => ({ locale: "en", article: article.uri })),
		...articlesRu.map(article => ({ locale: "ru", article: article.uri })),
	];
}

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

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/news/[article]">): Promise<Metadata> {
	const { article, locale } = await params;
	const computedLocale = hasLocale(routing.locales, locale) ? locale : "en";
	const { title, snippet, articleImage } = await getArticleMetadata(
		article,
		computedLocale,
	);

	return {
		title,
		description: snippet,
		// alternates: {
		// 	canonical: `/news/${uri}`,
		// 	languages: {
		// 		ru: `/ru/news/${uri}`,
		// 	},
		// },
		openGraph: {
			title,
			description: snippet,
			// url: `/news/${uri}`,
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
}: PageProps<"/[locale]/news/[article]">) {
	const { article: articleId, locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";

	//TODO: Investigate why locale is not updating server-side
	const article = await getArticle(articleId, language);
	const baseUrl = BASE_URL;
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
