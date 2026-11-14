import { ImagePlaceholder } from "@grod56/placeholder";
import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import database from "../third-party/prisma";
import { pickTranslation } from "../utilities/miscellaneous";
import {
	Article,
	ArticleAuthor,
	ArticleAuthorWithTranslations,
	Language,
} from "../utilities/types";

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
		const featuredArticle = getFeaturedArticle(language);
		const article = await database.article.findUniqueOrThrow({
			where: { link: articleId },
			include: _FULL_ARTICLE_INCLUDES,
		});
		const placeholder = article.image.placeholder
			.placeholder as ImagePlaceholder;
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
			datePublished: article.datePublished,
			dateUpdated: article.dateUpdated ?? undefined,
			body,
			snippet,
			articleImage: {
				url: article.image.link,
				caption: imageCaption ?? undefined,
				placeholder,
			},
			isArticleFeatured: article.link === (await featuredArticle)?.uri,
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
		const featuredArticle = getFeaturedArticle();
		const {
			title,
			author,
			body,
			snippet,
			datePublished,
			dateUpdated,
			image,
		} = await database.article.findUniqueOrThrow({
			where: { link: articleId },
			include: _FULL_ARTICLE_INCLUDES,
		});
		const placeholder = image.placeholder.placeholder as ImagePlaceholder;
		return {
			uri: articleId,
			title,
			author,
			datePublished,
			dateUpdated: dateUpdated ?? undefined,
			body,
			snippet,
			articleImage: {
				url: image.link,
				caption: image.caption ?? undefined,
				placeholder,
			},
			isArticleFeatured: articleId === (await featuredArticle)?.uri,
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

	const featuredArticle = await getFeaturedArticle();
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
					datePublished,
					dateUpdated,
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
						datePublished: datePublished,
						dateUpdated: dateUpdated ?? undefined,
						snippet: snippet.russian ?? snippet.english,
						articleImage: {
							url: image.link,
							caption:
								image.caption.russian ?? image.caption.english,
						},
						isArticleFeatured: link === featuredArticle?.uri,
					} satisfies Article;
				return {
					uri: link,
					title: title.english,
					author: {
						name: author.name.english,
						email: author.email ?? undefined,
					},
					body: body.english,
					datePublished: datePublished,
					dateUpdated: dateUpdated ?? undefined,
					snippet: snippet.english,
					articleImage: {
						url: image.link,
						caption: image.caption.russian ?? image.caption.english,
					},
					isArticleFeatured: link === featuredArticle?.uri,
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
			datePublished: article.datePublished,
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
			| "datePublished"
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

export async function getFeaturedArticle(language: Language = "en") {
	const currentDate = new Date();

	const featuredArticle = await database.featuredArticle.findFirst({
		include: { article: { include: _FULL_ARTICLE_INCLUDES } },
		where: {
			article: {
				removedArticle: { is: null },
				datePublished: { lte: currentDate },
			},
		},
		orderBy: {
			dateFeatured: "desc",
		},
	});
	if (!featuredArticle) return null;
	const {
		title,
		body,
		author,
		snippet,
		datePublished,
		dateUpdated,
		link,
		image,
	} = featuredArticle.article;

	return {
		uri: link,
		title: pickTranslation(title, language),
		author: {
			name: pickTranslation(author.name, language),
			email: author.email,
		},
		body: pickTranslation(body, language),
		datePublished,
		dateUpdated: dateUpdated ?? undefined,
		snippet: pickTranslation(snippet, language),
		articleImage: {
			url: image.link,
			caption: pickTranslation(image.caption, language),
			placeholder: image.placeholder.placeholder as ImagePlaceholder,
		},
		isArticleFeatured: true as const,
	} satisfies Article & { isArticleFeatured: true };
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
