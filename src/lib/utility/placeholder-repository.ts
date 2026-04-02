import { PrismaClient } from "@/src/generated/prisma/client";
import { PlaceholderRepository, ImagePlaceholder } from "@grod56/placeholder";

async function findPlaceholder(
	src: string,
	baseUrl: string,
	prismaClient: PrismaClient,
) {
	"use server";
	let processedSrc;
	try {
		const url = new URL(src);
		if (baseUrl.includes(url.hostname)) processedSrc = url.pathname;
		else processedSrc = url.href;
	} catch (error) {
		if (!(error instanceof TypeError)) throw error;
		processedSrc = src;
	}
	const result = await prismaClient.imagePlaceholder.findFirst({
		where: {
			imageLink: processedSrc,
		},
	});
	return result?.placeholder as ImagePlaceholder;
}
async function setPlaceholder(
	src: string,
	placeholder: ImagePlaceholder,
	baseUrl: string,
	prismaClient: PrismaClient,
): Promise<void> {
	"use server";

	let processedSrc;
	try {
		const url = new URL(src);
		if (baseUrl.includes(url.hostname)) processedSrc = url.pathname;
		else processedSrc = url.href;
	} catch (error) {
		if (!(error instanceof TypeError)) throw error;
		processedSrc = src;
	}
	await prismaClient.imagePlaceholder.create({
		data: {
			imageLink: processedSrc,
			placeholder,
		},
	});
}

export function getPrismaPlaceholderRepository(
	baseUrl: string,
	prismaClient: PrismaClient,
): PlaceholderRepository {
	return {
		findPlaceholder(src: string) {
			return findPlaceholder(src, baseUrl, prismaClient);
		},
		setPlaceholder(src, placeholder) {
			return setPlaceholder(src, placeholder, baseUrl, prismaClient);
		},
	};
}
