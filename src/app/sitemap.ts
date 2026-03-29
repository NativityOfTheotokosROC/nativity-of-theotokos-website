import type { MetadataRoute } from "next";
import { getBaseURL } from "../lib/server-action/miscellaneous";
import { getAllArticles } from "../lib/server-action/news-article";

export const dynamic = "force-static";

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
