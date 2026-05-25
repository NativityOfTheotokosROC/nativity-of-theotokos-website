import "server-only";

import {
	ImagePlaceholder,
	getPlaceholder as generatePlaceholder,
} from "@grod56/placeholder";
import { unstable_cache } from "next/cache";
import database from "../third-party/prisma";
import { BASE_URL } from "../utilities/server-constants";

export const getPlaceholder = unstable_cache(
	async (imageSource: string) => {
		// "use cache: remote";
		// cacheLife("weeks");

		const result = await findPlaceholder(imageSource);
		if (result) return result;
		const placeholder = await generatePlaceholder(imageSource);
		console.log("Placeholder generated for " + imageSource);
		await setPlaceholder(imageSource, placeholder);
		return placeholder;
	},
	undefined,
	{ revalidate: false },
);

async function findPlaceholder(src: string) {
	let processedSrc;
	try {
		const url = new URL(src);
		if (BASE_URL.includes(url.hostname)) processedSrc = url.pathname;
		else processedSrc = url.href;
	} catch (error) {
		if (!(error instanceof TypeError)) throw error;
		processedSrc = src;
	}
	const result = await database.imagePlaceholder.findFirst({
		where: {
			imageLink: processedSrc,
		},
	});
	return result?.placeholder
		? (result.placeholder as ImagePlaceholder)
		: null;
}

async function setPlaceholder(
	src: string,
	placeholder: ImagePlaceholder,
): Promise<void> {
	let processedSrc;
	try {
		const url = new URL(src);
		if (BASE_URL.includes(url.hostname)) processedSrc = url.pathname;
		else processedSrc = url.href;
	} catch (error) {
		if (!(error instanceof TypeError)) throw error;
		processedSrc = src;
	}
	await database.imagePlaceholder.create({
		data: {
			imageLink: processedSrc,
			placeholder,
		},
	});
}
