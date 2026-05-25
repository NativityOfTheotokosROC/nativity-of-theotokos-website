import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import database from "../third-party/prisma";
import { Article, Language } from "../types/general";

export const getAllArticles = unstable_cache(
	async (language: Language) => {
		// "use cache: remote";
		// cacheTag("bulletin_articles");
		// cacheLife("hours");

		const articles: Article[] = await database.article
			.findMany({
				include: {
					title: true,
					author: { include: { name: true } },
					body: true,
					snippet: true,
					image: { include: { caption: true } },
				},
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
					} = record;
					if (language === "ru")
						return {
							uri: link,
							title: title.russian ?? title.english,
							author: author.name.russian ?? author.name.english,
							body: body.russian ?? body.english,
							dateCreated,
							dateUpdated: dateUpdated ?? undefined,
							snippet: snippet.russian ?? snippet.english,
							articleImage: {
								source: image.link,
								about:
									image.caption.russian ??
									image.caption.english,
							},
						} satisfies Article;
					return {
						uri: link,
						title: title.english,
						author: author.name.english,
						body: body.english,
						dateCreated,
						dateUpdated: dateUpdated ?? undefined,
						snippet: snippet.english,
						articleImage: {
							source: image.link,
							about:
								image.caption.russian ?? image.caption.english,
						},
					} satisfies Article;
				}),
			);
		return articles;
	},
	undefined,
	{ tags: ["bulletin_articles"] },
);

export const getArticleMetadata = unstable_cache(
	async (articleId: string, language: Language) => {
		// "use cache";

		const locale = language;
		try {
			const article = await database.article.findUniqueOrThrow({
				include: {
					title: true,
					author: { include: { name: true } },
					snippet: true,
					image: { include: { caption: true } },
				},
				where: { link: articleId },
				omit: { dateCreated: true, dateUpdated: true },
			});
			const title =
				locale === "ru" && article.title.russian
					? article.title.russian
					: article.title.english;
			const author =
				locale === "ru" && article.author.name.russian
					? article.author.name.russian
					: article.author.name.english;
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
					source: article.image.link,
					about: caption,
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
	},
);
