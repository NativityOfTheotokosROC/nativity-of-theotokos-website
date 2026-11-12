import { routing } from "@/src/i18n/routing";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import Article from "../../../../lib/components/views/article/Article";
import { BASE_URL } from "@/src/lib/utilities/server-constants";
import {
	getAllArticles,
	getArticle,
	getArticleMetadata,
} from "@/src/lib/server-only/article";
import { Article as JSONLdArticle, WithContext } from "schema-dts";
import { cacheTag } from "next/cache";

// const CACHE_TAG = "article";
type ArticleMetadata = Awaited<ReturnType<typeof getArticleMetadata>>;

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

function articleJsonLd(article: ArticleMetadata) {
	const { title, author, articleImage, datePublished, snippet } = article;
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: title,
		description: snippet,
		datePublished: datePublished.toISOString(),
		author: {
			"@type": "Person",
			name: author,
		},
		image: articleImage.url,
	} satisfies WithContext<JSONLdArticle>;
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/news/[article]">): Promise<Metadata> {
	"use cache";

	const { article, locale } = await params;
	const computedLocale = hasLocale(routing.locales, locale) ? locale : "en";
	const { title, author, snippet, uri, articleImage } =
		await getArticleMetadata(article, computedLocale);
	cacheTag(`article_${uri}`);

	return {
		title,
		description: snippet,
		alternates: {
			canonical: `/news/${uri}`,
			languages: {
				en: `/news/${uri}`,
				ru: `/ru/news/${uri}`,
			},
		},
		openGraph: {
			title,
			description: snippet,
			url: `/news/${uri}`,
			authors: author,
			type: "article",
			images: [articleImage.url],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: snippet,
			images: [articleImage.url],
		},
	};
}

export default async function Page({
	params,
}: PageProps<"/[locale]/news/[article]">) {
	"use cache";

	const { article: articleId, locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const article = await getArticle(articleId, language);
	const processedArticle = { ...article, author: article.author.name };
	cacheTag(`article_${article.uri}`);
	const baseUrl = `${BASE_URL}${language == "ru" ? "/ru" : ""}`;
	const permalink = `${baseUrl}/news/${article.uri.toString()}`;
	const jsonLd = articleJsonLd(processedArticle);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Article
				model={newReadonlyModel({
					article: processedArticle,
					permalink,
				})}
			/>
		</>
	);
}
