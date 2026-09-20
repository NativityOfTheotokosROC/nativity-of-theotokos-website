import { NewArticle } from "../validation/article";
import { ArticleWithTranslations } from "./types";

export function hasArticleChanged(
	existingArticle: Omit<
		ArticleWithTranslations,
		"dateUpdated" | "dateCreated" | "uri" | "isArticleFeatured"
	>,
	newArticle: NewArticle,
) {
	return !(existingArticle.title.english === newArticle.title.english &&
	newArticle.snippet
		? existingArticle.snippet.english === newArticle.snippet.english
		: true && newArticle.authorName.english
			? existingArticle.author.name.english ===
				newArticle.authorName.english
			: true &&
				  existingArticle.articleImage.url === newArticle.image.url &&
				  existingArticle.articleImage.caption ===
						newArticle.image.caption &&
				  existingArticle.body.english === newArticle.body.english &&
				  existingArticle.title.russian === newArticle.title.russian &&
				  newArticle.snippet
				? existingArticle.snippet.russian === newArticle.snippet.russian
				: true && newArticle.authorName.russian
					? existingArticle.author.name.russian ===
						newArticle.authorName.russian
					: true &&
						existingArticle.articleImage.url ===
							newArticle.image.url &&
						existingArticle.articleImage.caption ===
							newArticle.image.caption &&
						existingArticle.body.russian ===
							newArticle.body.russian);
}
