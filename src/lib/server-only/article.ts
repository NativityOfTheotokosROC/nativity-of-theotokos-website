import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import database from "../third-party/prisma";
import {
	Article,
	ArticleAuthor,
	ArticleAuthorWithTranslations,
	Language,
} from "../utilities/types";
import { ImagePlaceholder, getPlaceholder } from "@grod56/placeholder";
import { isRemotePath, pickTranslation } from "../utilities/miscellaneous";
import { BASE_URL } from "../utilities/server-constants";

export const _FULL_ARTICLE_INCLUDES = {
	author: { include: { name: true } },
	title: true,
	body: true,
	snippet: true,
	image: { include: { placeholder: true, caption: true } },
	featuredArticle: true,
};

export async function getArticle(articleId: string, language: Language) {
	"use cache: remote";
	cacheTag(`article_${articleId}`);

	const locale = language;
	try {
		const article = await database.article.findUniqueOrThrow({
			where: { link: articleId },
			include: _FULL_ARTICLE_INCLUDES,
		});
		const baseUrl = BASE_URL;

		const placeholder =
			(article.image.placeholder?.placeholder as ImagePlaceholder) ??
			(await getPlaceholder(
				isRemotePath(article.image.link)
					? article.image.link
					: `${baseUrl}${article.image.link}`,
			));
		const title = pickTranslation(article.title, locale);
		const author = {
			name: pickTranslation(article.author.name, locale),
			email: article.author.email ?? undefined,
		} satisfies ArticleAuthor;
		const body = pickTranslation(article.body, locale);
		const snippet = pickTranslation(article.snippet, locale);
		const imageCaption = pickTranslation(article.image.caption, locale);

		return {
			uri: articleId,
			title,
			author,
			dateCreated: article.dateCreated,
			dateUpdated: article.dateUpdated ?? undefined,
			body,
			snippet,
			articleImage: {
				url: article.image.link,
				caption: imageCaption ?? undefined,
				placeholder,
			},
			isArticleFeatured: article.featuredArticle !== null,
		} satisfies Omit<Article, "url">;
	} catch (error) {
		if (
			error instanceof Object &&
			"code" in error &&
			error["code"] === "P2025"
		)
			notFound();
		throw error;
	}
}

//TODO: Refactor
export async function getArticleWithTranslations(articleId: string) {
	"use cache: remote";
	cacheTag(`article_${articleId}`);

	try {
		const {
			title,
			author,
			body,
			snippet,
			dateCreated,
			dateUpdated,
			image,
			featuredArticle,
		} = await database.article.findUniqueOrThrow({
			where: { link: articleId },
			include: _FULL_ARTICLE_INCLUDES,
		});
		const baseUrl = BASE_URL;
		const placeholder =
			(image.placeholder?.placeholder as ImagePlaceholder) ??
			(await getPlaceholder(
				isRemotePath(image.link)
					? image.link
					: `${baseUrl}${image.link}`,
			));
		return {
			uri: articleId,
			title,
			author,
			dateCreated,
			dateUpdated: dateUpdated ?? undefined,
			body,
			snippet,
			articleImage: {
				url: image.link,
				caption: image.caption ?? undefined,
				placeholder,
			},
			isArticleFeatured: featuredArticle !== null,
		};
	} catch (error) {
		if (
			error instanceof Object &&
			"code" in error &&
			error["code"] === "P2025"
		)
			notFound();
		throw error;
	}
}

export async function getAllArticles(language: Language) {
	"use cache: remote";
	cacheTag("bulletin_articles");
	cacheLife("hours");

	const articles = await database.article
		.findMany({
			include: _FULL_ARTICLE_INCLUDES,
		})
		.then(records =>
			records.map(record => {
				const {
					title,
					author,
					body,
					snippet,
					link,
					image,
					dateCreated,
					dateUpdated,
					featuredArticle,
				} = record;
				if (language === "ru")
					return {
						uri: link,
						title: title.russian ?? title.english,
						author: {
							name: author.name.russian ?? author.name.english,
							email: author.email ?? undefined,
						},
						body: body.russian ?? body.english,
						dateCreated,
						dateUpdated: dateUpdated ?? undefined,
						snippet: snippet.russian ?? snippet.english,
						articleImage: {
							url: image.link,
							caption:
								image.caption.russian ?? image.caption.english,
						},
						isArticleFeatured: featuredArticle !== null,
					} satisfies Article;
				return {
					uri: link,
					title: title.english,
					author: {
						name: author.name.english,
						email: author.email ?? undefined,
					},
					body: body.english,
					dateCreated,
					dateUpdated: dateUpdated ?? undefined,
					snippet: snippet.english,
					articleImage: {
						url: image.link,
						caption: image.caption.russian ?? image.caption.english,
					},
					isArticleFeatured: featuredArticle !== null,
				} satisfies Article;
			}),
		);
	return articles;
}

export async function getArticleMetadata(
	articleId: string,
	language: Language,
) {
	"use cache";
	cacheTag(`article_${articleId}`);

	try {
		const article = await database.article.findUniqueOrThrow({
			include: _FULL_ARTICLE_INCLUDES,
			where: { link: articleId },
		});
		const title = pickTranslation(article.title, language);
		const author = pickTranslation(article.author.name, language);
		const snippet = pickTranslation(article.snippet, language);
		const caption = pickTranslation(article.image.caption, language);
		return {
			uri: article.link.toString(),
			title,
			author,
			snippet,
			dateCreated: article.dateCreated,
			dateUpdated: article.dateUpdated ?? undefined,
			articleImage: {
				url: article.image.link,
				caption,
			},
		} satisfies Pick<
			Article,
			| "uri"
			| "title"
			| "author"
			| "snippet"
			| "articleImage"
			| "dateCreated"
			| "dateUpdated"
		>;
	} catch (error) {
		if (
			error instanceof Object &&
			"code" in error &&
			error["code"] === "P2025"
		)
			notFound();
		throw error;
	}
}

export async function getArticleAuthors() {
	// "use cache: remote";
	// cacheTag(`article_authors`);

	const authors = (
		await database.articleAuthor.findMany({ include: { name: true } })
	).map(
		record =>
			({
				name: record.name.english,
				email: record.email,
			}) satisfies Required<ArticleAuthor>,
	);
	return authors satisfies Required<ArticleAuthor>[];
}

export async function getArticleAuthorsWithTranslations() {
	// "use cache: remote";
	// cacheTag(`article_authors`);

	const authors = (
		await database.articleAuthor.findMany({ include: { name: true } })
	).map(
		record =>
			({
				name: record.name,
				email: record.email,
			}) satisfies Required<ArticleAuthorWithTranslations>,
	);
	return authors satisfies Required<ArticleAuthorWithTranslations>[];
}
