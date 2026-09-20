import { ImagePlaceholder, getPlaceholder } from "@grod56/placeholder";
import { arrayToShuffled } from "array-shuffle";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";
import { LatestArticles } from "../server-actions/home";
import { dailyReadings } from "../third-party/holytrinityorthodox";
import database from "../third-party/prisma";
import { getDateString } from "../utilities/date-time";
import { isRemotePath } from "../utilities/miscellaneous";
import { BASE_URL } from "../utilities/server-constants";
import {
	ArticleAuthor,
	DailyQuote,
	GalleryImage,
	Language,
} from "../utilities/types";
import { _FULL_ARTICLE_INCLUDES } from "./article";
import { getGalleryImages } from "./gallery";

export const getDailyReadings = async (
	currentDate: Date,
	language: Language,
) => {
	"use cache: remote";
	cacheTag("daily-readings");
	cacheLife("max");

	const locale = language;
	return await dailyReadings(currentDate, locale).then(async readings => {
		const placeholder = await getPlaceholder(readings.iconOfTheDay.source);
		return {
			...readings,
			iconOfTheDay: {
				...readings.iconOfTheDay,
				placeholder,
			},
		};
	});
};

export async function getDailyQuote(currentDate: Date, language: Language) {
	"use cache: remote";
	cacheTag("daily-quote");
	cacheLife("days");

	const locale = language;
	const localDate = new Date(getDateString(currentDate, true));

	let dailyQuote = await database.dailyQuote
		.findFirst({
			where: {
				date: localDate,
			},
		})
		.quote({
			include: {
				author: {
					include: { name: true },
				},
				quote: true,
				source: true,
			},
		});
	if (!dailyQuote) {
		const quotes = await database.quote.findMany({
			include: {
				author: {
					include: { name: true },
				},
				quote: true,
				source: true,
			},
		});
		dailyQuote = quotes[Math.round(Math.random() * (quotes.length - 1))];
		await database.dailyQuote.create({
			data: {
				date: localDate,
				quoteId: dailyQuote.id,
			},
		});
	}
	return (
		locale === "ru"
			? {
					quote: dailyQuote.quote.russian ?? dailyQuote.quote.english,
					author:
						dailyQuote.author.name.russian ??
						dailyQuote.author.name.english,
					source:
						dailyQuote.source?.russian ??
						dailyQuote.source?.english ??
						null,
				}
			: {
					quote: dailyQuote.quote.english,
					author: dailyQuote.author.name.english,
					source: dailyQuote.source?.english ?? null,
				}
	) satisfies DailyQuote;
}

export async function getLatestArticles(
	otherArticlesCount: number,
	language: Language,
): Promise<LatestArticles> {
	"use cache: remote";
	cacheTag("latest-articles");

	const featuredArticleRecord =
		await database.featuredArticle.findFirstOrThrow({
			include: { article: { include: _FULL_ARTICLE_INCLUDES } },
		});
	const otherArticleRecords = await database.article.findMany({
		where: {
			featuredArticle: {
				is: null,
			},
		},
		include: _FULL_ARTICLE_INCLUDES,
		orderBy: {
			dateCreated: "desc",
		},
		take: otherArticlesCount,
	});
	const allArticleRecords = [
		featuredArticleRecord.article,
		...otherArticleRecords,
	];
	const unplaceholderedArticles = allArticleRecords.filter(
		article => article.image.placeholder === null,
	);
	const newPlaceholders = new Map<number, ImagePlaceholder>();

	if (unplaceholderedArticles.length) {
		for (let i = 0; i < unplaceholderedArticles.length; i++) {
			const imageLink = unplaceholderedArticles[i].image.link;
			const imageURL = isRemotePath(imageLink)
				? imageLink
				: `${BASE_URL}${imageLink}`;
			newPlaceholders.set(
				unplaceholderedArticles[i].id,
				await getPlaceholder(imageURL),
			);
		}
	}

	const featuredArticle = featuredArticleRecord.article;
	const title =
		language === "ru" && featuredArticle.title.russian
			? featuredArticle.title.russian
			: featuredArticle.title.english;
	const author = {
		name:
			language === "ru" && featuredArticle.author.name.russian != null
				? featuredArticle.author.name.russian
				: featuredArticle.author.name.english,
		email: featuredArticle.author.email ?? undefined,
	} satisfies ArticleAuthor;
	const snippet =
		language === "ru" && featuredArticle.snippet.russian
			? featuredArticle.snippet.russian
			: featuredArticle.snippet.english;
	return {
		featuredArticle: {
			...featuredArticleRecord.article,
			title,
			author,
			snippet,
			uri: featuredArticleRecord.article.link,
			articleImage: {
				url: featuredArticleRecord.article.image.link,
				caption:
					language === "ru"
						? (featuredArticleRecord.article.image.caption
								.russian ??
							featuredArticleRecord.article.image.caption.english)
						: featuredArticleRecord.article.image.caption.english,
				placeholder:
					(featuredArticleRecord.article.image.placeholder
						?.placeholder as ImagePlaceholder) ??
					newPlaceholders.get(featuredArticleRecord.article.id),
			},
			isArticleFeatured: true,
		},
		otherNewsArticles: otherArticleRecords.map(article => {
			const title =
				language === "ru" && article.title.russian
					? article.title.russian
					: article.title.english;
			const author = {
				name:
					language === "ru" && article.author.name.russian != null
						? article.author.name.russian
						: article.author.name.english,
				email: article.author.email ?? undefined,
			} satisfies ArticleAuthor;
			const snippet =
				language === "ru" && article.snippet.russian
					? article.snippet.russian
					: article.snippet.english;
			return {
				...article,
				title,
				author,
				snippet,
				uri: article.link,
				articleImage: {
					url: article.image.link,
					caption:
						language === "ru"
							? (article.image.caption.russian ??
								article.image.caption.english)
							: article.image.caption.english,
					placeholder:
						(article.image.placeholder
							?.placeholder as ImagePlaceholder) ??
						newPlaceholders.get(article.id),
				},
				isArticleFeatured: article.featuredArticle !== null,
			};
		}),
	};
}

// TODO: Optimize asap
export async function getDailyGalleryImages(count: number, currentDate: Date) {
	"use cache: remote";
	cacheTag("daily-gallery-images");
	cacheLife("days");

	const baseUrl = BASE_URL;
	const localDate = new Date(getDateString(currentDate, true));
	const promises = await Promise.all([
		getGalleryImages(),
		database.dailyGalleryImage.findMany({
			include: {
				placeholder: true,
			},
			where: {
				date: localDate,
			},
		}),
	]);
	const allGalleryImages = promises[0];
	let dailyGalleryImages = promises[1];

	const dailyGalleryImageLinks = dailyGalleryImages.map(
		dailyGalleryImage => dailyGalleryImage.link,
	);
	const otherGalleryImages = allGalleryImages.filter(
		galleryImage => !(galleryImage.imageLink in dailyGalleryImageLinks),
	);

	if (dailyGalleryImages.length < count && otherGalleryImages.length > 0) {
		const shuffledGalleryImages = arrayToShuffled(otherGalleryImages);
		if (otherGalleryImages.length + dailyGalleryImages.length <= count) {
			const newDailyGalleryImages =
				await database.dailyGalleryImage.createManyAndReturn({
					include: { placeholder: true },
					data: shuffledGalleryImages.map(galleryImage => ({
						date: localDate,
						link: galleryImage.imageLink,
					})),
				});
			dailyGalleryImages = [
				...dailyGalleryImages,
				...newDailyGalleryImages,
			];
		} else {
			const newDailyGalleryImages =
				await database.dailyGalleryImage.createManyAndReturn({
					include: { placeholder: true },
					data: shuffledGalleryImages
						.slice(0, count - dailyGalleryImages.length)
						.map(galleryImage => ({
							date: localDate,
							link: galleryImage.imageLink,
						})),
				});
			dailyGalleryImages = [
				...dailyGalleryImages,
				...newDailyGalleryImages,
			];
		}
	}
	const placeholderedGalleryImages: GalleryImage[] = [];
	for (let i = 0; i < dailyGalleryImages.length; i++) {
		const imageLink = dailyGalleryImages[i].link;
		const placeholder = dailyGalleryImages[i].placeholder;
		if (placeholder) {
			placeholderedGalleryImages.push({
				image: {
					source: imageLink,
					placeholder: placeholder.placeholder as ImagePlaceholder,
				},
			});
			continue;
		}
		const imageURL = isRemotePath(imageLink)
			? imageLink
			: `${baseUrl}${imageLink}`;
		placeholderedGalleryImages.push({
			image: {
				source: imageLink,
				placeholder: await getPlaceholder(imageURL),
			},
		});
	}
	return placeholderedGalleryImages;
}
