import type { MetadataRoute } from "next";
import { getAllArticles } from "../lib/server-action/news-article";
import { getBaseURL } from "../lib/server-action/miscellaneous";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

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
