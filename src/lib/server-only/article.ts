import { cacheTag, cacheLife } from "next/cache";
import prisma from "../third-party/prisma";
import { Language, Article } from "../types/general";
import { notFound } from "next/navigation";

export async function getAllArticles(language: Language): Promise<Article[]> {
	"use cache: remote";
	cacheTag("bulletin_articles");
	cacheLife("hours");

	const articles: Article[] = await prisma.article
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
								image.caption.russian ?? image.caption.english,
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
						about: image.caption.russian ?? image.caption.english,
					},
				} satisfies Article;
			}),
		);
	return articles;
}

export async function getArticleMetadata(
	articleId: string,
	language: Language,
): Promise<Pick<Article, "uri" | "title" | "snippet" | "articleImage">> {
	"use cache";

	const locale = language;
	try {
		const article = await prisma.article.findUniqueOrThrow({
			include: {
				title: true,
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
}
