import type { MetadataRoute } from "next";
import { BASE_URL } from "../lib/utilities/server-constants";
import { getAllArticles } from "../lib/server-only/article";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	"use cache";

	const baseUrl = BASE_URL;
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
		{
			url: `${baseUrl}/daily-saint`,
			changeFrequency: "daily",
			priority: 1,
			alternates: {
				languages: {
					ru: `${baseUrl}/ru/daily-saint`,
				},
			},
		},
		{
			url: `${baseUrl}/privacy-policy`,
			alternates: {
				languages: {
					ru: `${baseUrl}/ru/privacy-policy`,
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
