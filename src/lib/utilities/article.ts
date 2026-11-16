import { QueryClient, useQuery } from "@tanstack/react-query";
import { getUserInformation } from "../server-actions/user";
import { NewArticle } from "../validation/article";
import { ArticleWithTranslations } from "./types";
import { useUserInformation } from "./user";
import { canUserEditArticle } from "../server-actions/article";

export function hasArticleChanged(
	existingArticle: Omit<
		ArticleWithTranslations,
		| "dateUpdated"
		| "datePublished"
		| "uri"
		| "isArticleFeatured"
		| "snippet"
	>,
	newArticle: NewArticle,
) {
	return !(
		existingArticle.title.english === newArticle.title.english &&
		(newArticle.authorName.english
			? existingArticle.author.name.english ===
				newArticle.authorName.english
			: true) &&
		existingArticle.articleImage.url === newArticle.image.url &&
		existingArticle.articleImage.caption === newArticle.image.caption &&
		existingArticle.body.english === newArticle.body.english &&
		existingArticle.title.russian === newArticle.title.russian &&
		(newArticle.authorName.russian
			? existingArticle.author.name.russian ===
				newArticle.authorName.russian
			: true) &&
		existingArticle.articleImage.url === newArticle.image.url &&
		existingArticle.articleImage.caption === newArticle.image.caption &&
		existingArticle.body.russian === newArticle.body.russian
	);
}

export function useCanUserEditArticle(
	articleUri: string,
	queryClient?: QueryClient,
) {
	const { data, isSuccess } = useQuery(
		{
			queryKey: ["canUserEditArticle"],
			queryFn: () => canUserEditArticle(articleUri),
			staleTime: Infinity,
			gcTime: Infinity,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		},
		queryClient,
	);

	if (isSuccess) return data;
}
