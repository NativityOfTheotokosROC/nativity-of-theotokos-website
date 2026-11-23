import { ImagePlaceholder } from "@grod56/placeholder";
import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import database from "../third-party/prisma";
import { pickTranslation } from "../utilities/miscellaneous";
import {
	Article,
	ArticleAuthor,
	ArticleWithTranslations,
	Language,
	MakeRequired,
	Translation,
} from "../utilities/types";

export const _FULL_AUTHOR_INCLUDES = {
	name: true,
	profile: {
		include: {
			description: true,
			picture: { include: { placeholder: true } },
		},
	},
};

export const _FULL_ARTICLE_INCLUDES = {
	author: { include: _FULL_AUTHOR_INCLUDES },
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
			id: article.author.id,
			uri: article.author.uri,
			name: pickTranslation(article.author.name, locale),
			email: article.author.email,
			profile: article.author.profile
				? {
						description: article.author.profile.description
							? pickTranslation(
									article.author.profile.description,
									locale,
								)
							: undefined,
						picture: article.author.profile.picture
							? {
									source: article.author.profile.picture.link,
									placeholder: article.author.profile.picture
										.placeholder
										.placeholder as ImagePlaceholder,
								}
							: undefined,
						contactEmail:
							article.author.profile.contactEmail ?? undefined,
					}
				: undefined,
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
	try {
		const featuredArticle = getFeaturedArticle(undefined, true);
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
			author: {
				id: author.id,
				uri: author.uri,
				name: author.name,
				email: author.email,
				profile: author.profile
					? {
							description:
								author.profile.description ?? undefined,
							picture: author.profile.picture
								? {
										source: author.profile.picture.link,
										placeholder: author.profile.picture
											.placeholder
											.placeholder as ImagePlaceholder,
									}
								: undefined,
							contactEmail:
								author.profile.contactEmail ?? undefined,
						}
					: undefined,
			},
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
		} satisfies Article<Translation>;
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
			records.map(
				({
					title,
					author,
					body,
					snippet,
					link,
					image,
					datePublished,
					dateUpdated,
				}) => {
					return {
						uri: link,
						title: pickTranslation(title, language),
						author: {
							id: author.id,
							uri: author.uri,
							name: pickTranslation(author.name, language),
							email: author.email ?? undefined,
							profile: author.profile
								? {
										description: author.profile.description
											? pickTranslation(
													author.profile.description,
													language,
												)
											: undefined,
										picture: author.profile.picture
											? {
													source: author.profile
														.picture.link,
													placeholder: author.profile
														.picture.placeholder
														.placeholder as ImagePlaceholder,
												}
											: undefined,
										contactEmail:
											author.profile.contactEmail ??
											undefined,
									}
								: undefined,
						},
						body: pickTranslation(body, language),
						datePublished: datePublished,
						dateUpdated: dateUpdated ?? undefined,
						snippet: pickTranslation(snippet, language),
						articleImage: {
							url: image.link,
							caption: pickTranslation(image.caption, language),
						},
						isArticleFeatured: link === featuredArticle?.uri,
					} satisfies Article;
				},
			),
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
			uri: article.link,
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

export async function getFeaturedArticle(
	language: Language = "en",
	includeUnpublished: boolean = false,
) {
	const currentDate = new Date();

	const featuredArticle = await database.featuredArticle.findFirst({
		include: { article: { include: _FULL_ARTICLE_INCLUDES } },
		where: {
			article: {
				removedArticle: { is: null },
				datePublished: !includeUnpublished
					? { lte: currentDate }
					: undefined,
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
			id: author.id,
			uri: author.uri,
			name: pickTranslation(author.name, language),
			email: author.email,
			profile: author.profile
				? {
						description: author.profile.description
							? pickTranslation(
									author.profile.description,
									language,
								)
							: undefined,
						picture: author.profile.picture
							? {
									source: author.profile.picture.link,
									placeholder: author.profile.picture
										.placeholder
										.placeholder as ImagePlaceholder,
								}
							: undefined,
						contactEmail: author.profile.contactEmail ?? undefined,
					}
				: undefined,
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

export async function getArticleAuthorWithTranslations({
	uri,
}: {
	uri: string;
}) {
	const record = await database.articleAuthor.findUnique({
		include: _FULL_AUTHOR_INCLUDES,
		where: { uri },
	});

	if (!record) notFound();

	const { name, email, profile, id } = record;

	return {
		id,
		uri,
		name,
		email,
		profile: profile
			? {
					description: profile.description ?? undefined,
					picture: profile.picture
						? {
								source: profile.picture.link,
								placeholder: profile.picture.placeholder
									.placeholder as ImagePlaceholder,
							}
						: undefined,
					contactEmail: profile.contactEmail ?? undefined,
				}
			: undefined,
	} satisfies ArticleAuthor<Translation>;
}

export async function getArticleAuthor(uri: string, language: Language) {
	const { email, name, profile, id } = await getArticleAuthorWithTranslations(
		{
			uri,
		},
	);
	return {
		id,
		uri,
		name: pickTranslation(name, language),
		email,
		profile: profile
			? {
					...profile,
					description: profile.description
						? pickTranslation(profile.description, language)
						: undefined,
				}
			: undefined,
	} satisfies ArticleAuthor;
}

export async function getArticleAuthorsWithTranslations() {
	// "use cache: remote";
	// cacheTag(`article_authors`);

	const authors = (
		await database.articleAuthor.findMany({
			include: _FULL_AUTHOR_INCLUDES,
		})
	).map(
		({ name, email, profile, uri, id }) =>
			({
				id,
				uri,
				name,
				email,
				profile: profile
					? {
							description: profile.description ?? undefined,
							picture: profile.picture
								? {
										source: profile.picture.link,
										placeholder: profile.picture.placeholder
											.placeholder as ImagePlaceholder,
									}
								: undefined,
							contactEmail: profile.contactEmail ?? undefined,
						}
					: undefined,
			}) satisfies MakeRequired<ArticleAuthor<Translation>, "email">,
	);
	return authors;
}
