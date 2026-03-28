import type { MetadataRoute } from "next";
import { getAllArticles } from "@/src/lib/server-action/news-article";
import { getBaseURL } from "@/src/lib/server-action/miscellaneous";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = await getBaseURL();
	const newsArticles = await getAllArticles();

	return [
		{
			url: "https://www.nativityoftheotokos.com",
			changeFrequency: "daily",
			priority: 1,
			alternates: {
				languages: {
					ru: "https://www.nativityoftheotokos.com/ru",
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
