import { Article, NewArticle } from "../types/general";

export function hasArticleChanged(
	existingArticle: Omit<Article, "dateUpdated" | "dateCreated" | "uri">,
	newArticle: NewArticle,
) {
	return (
		existingArticle.title === newArticle.title &&
		existingArticle.snippet === newArticle.snippet &&
		existingArticle.author.name === newArticle.authorName &&
		existingArticle.articleImage.source ===
			newArticle.articleImage.source &&
		existingArticle.articleImage.about === newArticle.articleImage.about &&
		existingArticle.body === newArticle.body
	);
}
