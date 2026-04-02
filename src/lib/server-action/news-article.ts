"use server";

import { Language, NewsArticle } from "../type/general";
import { notFound } from "next/navigation";
import { isRemotePath } from "../utility/miscellaneous";
import { getBaseURL } from "./miscellaneous";
import prisma from "../third-party/prisma";
import { getLocale } from "next-intl/server";
import { getPlaceholder } from "./placeholder";

export async function getAllArticles(): Promise<NewsArticle[]> {
	const articles: NewsArticle[] = await prisma.newsArticle
		.findMany()
		.then(records =>
			records.map(record => ({
				...record,
				uri: record.link,
				dateUpdated: record.dateUpdated ?? undefined,
				articleImage: {
					source: record.imageLink,
					about: record.imageCaption,
				},
			})),
		);
	return articles;
}

export async function getArticleMetadata(
	articleId: string,
	language?: Language,
): Promise<Omit<NewsArticle, "url" | "dateCreated" | "dateUpdated">> {
	"use cache";
	const locale = language ?? (await getLocale());
	try {
		const article = await prisma.newsArticle.findUniqueOrThrow({
			where: { link: articleId },
			omit: { dateCreated: true, dateUpdated: true },
		});
		const title =
			locale == "ru" && article.titleRu ? article.titleRu : article.title;
		const author =
			locale == "ru" && article.authorRu != null
				? article.authorRu
				: article.author;
		const body =
			locale == "ru" && article.bodyRu ? article.bodyRu : article.body;
		const snippet =
			locale == "ru" && article.snippetRu
				? article.snippetRu
				: article.snippet;
		return {
			uri: article.link.toString(),
			title,
			author,
			body,
			snippet,
			articleImage: {
				source: article.imageLink,
				about: article.imageCaption ?? undefined,
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
	language?: Language,
): Promise<Omit<NewsArticle, "url">> {
	"use cache";
	const locale = language ?? (await getLocale());
	try {
		const article = await prisma.newsArticle.findUniqueOrThrow({
			where: { link: articleId },
		});
		const baseUrl = await getBaseURL();

		const placeholder = await getPlaceholder(
			isRemotePath(article.imageLink)
				? article.imageLink
				: `${baseUrl}${article.imageLink}`,
		);
		const title =
			locale == "ru" && article.titleRu ? article.titleRu : article.title;
		const author =
			locale == "ru" && article.authorRu != null
				? article.authorRu
				: article.author;
		const body =
			locale == "ru" && article.bodyRu ? article.bodyRu : article.body;
		const snippet =
			locale == "ru" && article.snippetRu
				? article.snippetRu
				: article.snippet;
		//TODO: Add imageCaptionRu

		return {
			uri: article.link.toString(),
			title,
			author,
			dateCreated: article.dateCreated,
			dateUpdated: article.dateUpdated ?? undefined,
			body,
			snippet,
			articleImage: {
				source: article.imageLink,
				about: article.imageCaption ?? undefined,
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
