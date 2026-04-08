import type { MetadataRoute } from "next";
import { getAllArticles } from "../lib/server-action/news-article";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	"use cache";

	const baseUrl = process.env.BASE_URL;
	if (!baseUrl) throw new Error("Undefined BASE_URL");
	const newsArticles = await getAllArticles("en");

	return [
		{
			url: baseUrl,
			changeFrequency: "daily",
			priority: 1,
			alternates: {
				languages: {
					ru: `${baseUrl}/ru`,
				},
			},
		},
		...newsArticles.map(article => ({
			url: `${baseUrl}/news/${article.uri.toString()}`,
			lastModified: article.dateUpdated ?? article.dateCreated,
			changeFrequency: "monthly" as const,
			alternates: {
				languages: {
					ru: `${baseUrl}/ru/news/${article.uri.toString()}`,
				},
			},
		})),
	];
}
