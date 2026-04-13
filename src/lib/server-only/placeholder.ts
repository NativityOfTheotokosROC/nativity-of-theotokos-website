import "server-only";

import {
	ImagePlaceholder,
	getPlaceholder as generatePlaceholder,
} from "@grod56/placeholder";
import { cacheLife } from "next/cache";
import prisma from "../third-party/prisma";
import { BASE_URL } from "../utility/server-constant";

const baseUrl = BASE_URL;

export async function getPlaceholder(imageSource: string) {
	"use cache: remote";
	cacheLife("weeks");

	const result = await findPlaceholder(imageSource);
	if (result) return result;
	const placeholder = await generatePlaceholder(imageSource);
	await setPlaceholder(imageSource, placeholder);
	return placeholder;
}

async function findPlaceholder(src: string) {
	let processedSrc;
	try {
		const url = new URL(src);
		if (baseUrl.includes(url.hostname)) processedSrc = url.pathname;
		else processedSrc = url.href;
	} catch (error) {
		if (!(error instanceof TypeError)) throw error;
		processedSrc = src;
	}
	const result = await prisma.imagePlaceholder.findFirst({
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
		if (baseUrl.includes(url.hostname)) processedSrc = url.pathname;
		else processedSrc = url.href;
	} catch (error) {
		if (!(error instanceof TypeError)) throw error;
		processedSrc = src;
	}
	await prisma.imagePlaceholder.create({
		data: {
			imageLink: processedSrc,
			placeholder,
		},
	});
}
