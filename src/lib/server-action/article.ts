"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import prisma from "../third-party/prisma";
import { Language, NewsArticle } from "../type/general";
import { isRemotePath } from "../utility/miscellaneous";
import { BASE_URL } from "../utility/server-constant";
import { getPlaceholder } from "../server-only/placeholder";

export async function getArticle(
	articleId: string,
	language: Language,
): Promise<Omit<NewsArticle, "url">> {
	"use cache: remote";
	cacheTag("bulletin_article", articleId); // TODO: Explicitly setting articleId because of the placeholder notFound call (I think)

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
