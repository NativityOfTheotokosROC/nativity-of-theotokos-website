import { ImagePlaceholder, getPlaceholder } from "@grod56/placeholder";
import { arrayToShuffled } from "array-shuffle";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";
import { LatestArticles } from "../server-actions/home";
import { dailyReadings } from "../third-party/holytrinityorthodox";
import database from "../third-party/prisma";
import { isRemotePath, pickTranslation } from "../utilities/miscellaneous";
import { BASE_URL } from "../utilities/server-constants";
import { ArticleAuthor, GalleryImage, Language } from "../utilities/types";
import { _FULL_ARTICLE_INCLUDES, getFeaturedArticle } from "./article";
import { getGalleryImages } from "./gallery";

export async function getDailyReadings(currentDate: Date, language: Language) {
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
}

export async function getLatestArticles(
	otherArticlesCount: number,
	language: Language,
): Promise<LatestArticles> {
	"use cache: remote";
	cacheTag("latest-articles");

	const currentDate = new Date();
	const featuredArticle = await getFeaturedArticle(language);
	if (!featuredArticle) throw new Error("Featured article not found");
	const otherArticleRecords = await database.article.findMany({
		where: {
			featuredArticle: {
				is: null,
			},
			removedArticle: { is: null },
			datePublished: {
				lte: currentDate,
			},
		},
		include: _FULL_ARTICLE_INCLUDES,
		orderBy: {
			datePublished: "desc",
		},
		take: otherArticlesCount,
	});

	return {
		featuredArticle,
		otherNewsArticles: otherArticleRecords.map(article => {
			const title = pickTranslation(article.title, language);
			const author = {
				name: pickTranslation(article.author.name, language),
				email: article.author.email ?? undefined,
			} satisfies ArticleAuthor;
			const snippet = pickTranslation(article.snippet, language);
			return {
				...article,
				title,
				author,
				snippet,
				uri: article.link,
				articleImage: {
					url: article.image.link,
					caption: pickTranslation(article.image.caption, language),
					placeholder: article.image.placeholder
						.placeholder as ImagePlaceholder,
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
	const promises = await Promise.all([
		getGalleryImages(),
		database.dailyGalleryImage.findMany({
			include: {
				placeholder: true,
			},
			where: {
				date: currentDate,
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
						date: currentDate,
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
							date: currentDate,
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
