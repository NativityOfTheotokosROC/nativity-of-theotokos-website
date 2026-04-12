"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import prisma from "../third-party/prisma";
import { Language, NewsArticle } from "../type/general";
import { isRemotePath } from "../utility/miscellaneous";
import { BASE_URL } from "../utility/server-constant";
import { getPlaceholder } from "./placeholder";

export async function getAllArticles(
	language: Language,
): Promise<NewsArticle[]> {
	"use cache: remote";
	cacheTag("bulletin_articles");
	cacheLife("hours");

	const articles: NewsArticle[] = await prisma.article
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
				if (language == "ru")
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
					} satisfies NewsArticle;
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
				} satisfies NewsArticle;
			}),
		);
	return articles;
}

export async function getArticleMetadata(
	articleId: string,
	language: Language,
): Promise<Pick<NewsArticle, "uri" | "title" | "snippet" | "articleImage">> {
	"use cache: remote";

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
			locale == "ru" && article.title.russian
				? article.title.russian
				: article.title.english;
		const snippet =
			locale == "ru" && article.snippet.russian
				? article.snippet.russian
				: article.snippet.english;
		const caption =
			locale == "ru" && article.image.caption.russian
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
			error["code"] == "P2025"
		)
			notFound();
		throw error;
	}
}

export async function getArticle(
	articleId: string,
	language: Language,
): Promise<Omit<NewsArticle, "url">> {
	"use cache: remote";

	cacheTag("bulletin_article", articleId); // TODO: Explicitly setting articleId because of the placeholder notFound call (I think)
	cacheLife("days");
	const locale = language;
	try {
		const article = await prisma.article.findUniqueOrThrow({
			where: { link: articleId },
			include: {
				author: { include: { name: true } },
				title: true,
				body: true,
				snippet: true,
				image: { include: { caption: true, placeholder: true } },
			},
		});
		const baseUrl = BASE_URL;

		const placeholder =
			(article.image.placeholder?.placeholder as ImagePlaceholder) ??
			(await getPlaceholder(
				isRemotePath(article.image.link)
					? article.image.link
					: `${baseUrl}${article.image.link}`,
			));
		const title =
			locale == "ru" && article.title.russian
				? article.title.russian
				: article.title.english;
		const author =
			locale == "ru" && article.author.name.russian != null
				? article.author.name.russian
				: article.author.name.english;
		const body =
			locale == "ru" && article.body.russian
				? article.body.russian
				: article.body.english;
		const snippet =
			locale == "ru" && article.snippet.russian
				? article.snippet.russian
				: article.snippet.english;
		const imageCaption =
			locale == "ru" && article.image.caption.russian
				? article.image.caption.russian
				: article.image.caption.english;

		return {
			uri: article.link.toString(),
			title,
			author,
			dateCreated: article.dateCreated,
			dateUpdated: article.dateUpdated ?? undefined,
			body,
			snippet,
			articleImage: {
				source: article.image.link,
				about: imageCaption ?? undefined,
				placeholder,
			},
		};
	} catch (error) {
		if (
			error instanceof Object &&
			"code" in error &&
			error["code"] == "P2025"
		)
			notFound();
		throw error;
	}
}
