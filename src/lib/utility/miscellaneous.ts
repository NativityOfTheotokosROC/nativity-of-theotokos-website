import { PrismaClient } from "@/src/generated/prisma/client";
import { useRouter } from "@/src/i18n/navigation";
import { ImagePlaceholder, PlaceholderRepository } from "@grod56/placeholder";
import { Locale } from "next-intl";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function julianDate(date: Date) {
	return new Date(new Date().setDate(date.getDate() - 13));
}

export function removeMarkup(markedUpText: string): string {
	const regex: RegExp = /(<([^>]+)>)/gi;
	return markedUpText.replace(regex, "");
}

export function isRemotePath(src: string) {
	try {
		new URL(src);
		return true;
	} catch {
		return false;
	}
}

export const getPrismaPlaceholderRepository = (
	baseUrl: string,
	prismaClient: PrismaClient,
): PlaceholderRepository => {
	return {
		async findPlaceholder(src: string) {
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
		},
		async setPlaceholder(
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
			await prismaClient.imagePlaceholder.create({
				data: {
					imageLink: processedSrc,
					placeholder,
				},
			});
		},
	};
};

export function useModifiedRouter(pushCallback: () => void) {
	const router = useRouter();
	return {
		...router,
		push(
			href:
				| string
				| {
						pathname: string;
						query?: import("next-intl/navigation").QueryParams;
				  },
			options:
				| (Partial<NavigateOptions> & { locale?: Locale })
				| undefined,
		) {
			pushCallback();
			router.push(href, options);
		},
	};
}
