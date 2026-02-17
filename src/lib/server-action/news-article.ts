"use server";

import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NewsArticle } from "../type/miscellaneous";
import { notFound } from "next/navigation";
import {
	getPrismaPlaceholderRepository,
	isRemotePath,
} from "../utility/miscellaneous";
import { getBaseURL } from "./miscellaneous";
import { getPlaceholder } from "@grod56/placeholder";

const prismaAdapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prismaClient = new PrismaClient({
	adapter: prismaAdapter,
});

export async function getArticle(articleId: string): Promise<NewsArticle> {
	try {
		const article = await prismaClient.newsArticle.findUniqueOrThrow({
			where: { link: articleId },
		});
		const baseUrl = await getBaseURL();
		const placeholderRepository = getPrismaPlaceholderRepository(
			baseUrl,
			prismaClient,
		);
		const placeholder = await getPlaceholder(
			isRemotePath(article.imageLink)
				? article.imageLink
				: `${baseUrl}${article.imageLink}`,
			placeholderRepository,
		);
		return {
			uri: article.link.toString(),
			url: `${baseUrl}news/${article.link.toString()}`,
			title: article.title,
			author: article.author,
			dateCreated: article.dateCreated,
			dateUpdated: article.dateUpdated ?? undefined,
			body: article.body,
			snippet: article.snippet,
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
