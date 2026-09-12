import { getTranslations } from "next-intl/server";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import z from "zod";
import database from "../third-party/prisma";
import { removeMarkup, snippetify } from "../utilities/miscellaneous";
import {
	Article,
	ArticleAuthor,
	ArticleAuthorWithTranslations,
	Language,
	Translation,
} from "../utilities/types";
import {
	getArticleSchema,
	MAX_SNIPPET,
	NewArticle,
} from "../validation/article";

export const _FULL_ARTICLE_INCLUDES = {
	author: { include: { name: true } },
	title: true,
	body: true,
	snippet: true,
	image: { include: { placeholder: true, caption: true } },
	featuredArticle: true,
};
export async function getAllArticles(language: Language): Promise<Article[]> {
	"use cache: remote";
	cacheTag("bulletin_articles");
	cacheLife("hours");

	const articles: Article[] = await database.article
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
): Promise<
	Pick<Article, "uri" | "title" | "author" | "snippet" | "articleImage">
> {
	"use cache";
	cacheTag(`article_${articleId}`);

	const locale = language;
	try {
		const article = await database.article.findUniqueOrThrow({
			include: _FULL_ARTICLE_INCLUDES,
			where: { link: articleId },
			omit: { dateCreated: true, dateUpdated: true },
		});
		const title =
			locale === "ru" && article.title.russian
				? article.title.russian
				: article.title.english;
		const author = {
			name:
				locale === "ru" && article.author.name.russian
					? article.author.name.russian
					: article.author.name.english,
			email: article.author.email ?? undefined,
		} satisfies ArticleAuthor;
		const snippet =
			locale === "ru" && article.snippet.russian
				? article.snippet.russian
				: article.snippet.english;
		const caption =
			locale === "ru" && article.image.caption.russian
				? article.image.caption.russian
				: article.image.caption.english;
		return {
			uri: article.link.toString(),
			title,
			author,
			snippet,
			articleImage: {
				url: article.image.link,
				caption,
			},
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

export async function getArticleAuthors() {
	"use cache: remote";
	cacheTag(`article_authors`);
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
	"use cache: remote";
	cacheTag(`article_authors`);
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

export async function validateNewArticle(
	newArticle: NewArticle,
	locale?: Language,
) {
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleSchema = getArticleSchema(t).transform(newArticle => ({
		...newArticle,
		snippet: {
			english:
				newArticle.snippet.english ??
				snippetify(removeMarkup(newArticle.body.english), MAX_SNIPPET),
			russian:
				newArticle.snippet.russian ??
				(newArticle.body.russian
					? snippetify(
							removeMarkup(newArticle.body.russian),
							MAX_SNIPPET,
						)
					: undefined),
		} satisfies Translation,
		link: z.string().slugify().parse(newArticle.title),
	}));

	return articleSchema.parse(newArticle) satisfies NewArticle & {
		link: string;
	};
}
