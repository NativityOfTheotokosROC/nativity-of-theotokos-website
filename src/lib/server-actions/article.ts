"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { cacheTag } from "next/cache";
import { forbidden, notFound } from "next/navigation";
import database from "../third-party/prisma";
import { Language, Article } from "../types/general";
import { isRemotePath } from "../utilities/miscellaneous";
import { BASE_URL } from "../utilities/server-constants";
import { getPlaceholder } from "../server-only/placeholder";
import { getUser, protect } from "./auth";
import { NewArticle } from "../models/new-article";
import { getTranslations } from "next-intl/server";
import { getArticleFormSchema } from "../validation/article-form";
import z from "zod";

export async function getArticle(
	articleId: string,
	language: Language,
): Promise<Omit<Article, "url">> {
	"use cache: remote";
	cacheTag("bulletin_article");

	const locale = language;
	try {
		const article = await database.article.findUniqueOrThrow({
			where: { link: articleId },
			include: {
				author: { include: { name: true } },
				title: true,
				body: true,
				snippet: true,
				image: { include: { caption: true, placeholder: true } },
			},
		});
		const baseUrl = BASE_URL;

		const placeholder =
			(article.image.placeholder?.placeholder as ImagePlaceholder) ??
			(await getPlaceholder(
				isRemotePath(article.image.link)
					? article.image.link
					: `${baseUrl}${article.image.link}`,
			));
		const title =
			locale === "ru" && article.title.russian
				? article.title.russian
				: article.title.english;
		const author =
			locale === "ru" && article.author.name.russian != null
				? article.author.name.russian
				: article.author.name.english;
		const body =
			locale === "ru" && article.body.russian
				? article.body.russian
				: article.body.english;
		const snippet =
			locale === "ru" && article.snippet.russian
				? article.snippet.russian
				: article.snippet.english;
		const imageCaption =
			locale === "ru" && article.image.caption.russian
				? article.image.caption.russian
				: article.image.caption.english;

		return {
			uri: article.link.toString(),
			title,
			author,
			dateCreated: article.dateCreated,
			dateUpdated: article.dateUpdated ?? undefined,
			body,
			snippet,
			articleImage: {
				source: article.image.link,
				about: imageCaption ?? undefined,
				placeholder,
			},
		};
	} catch (error) {
		if (
			error instanceof Object &&
			"code" in error &&
			error["code"] === "P2025"
		)
			notFound();
		throw error;
	}
}

export async function saveDraft(draft: NewArticle, locale?: Language) {
	const { ticketId } = draft;
	const user = await getUser();
	if (!user) forbidden();
	if (
		!(await database.articleTicket.findUnique({
			where: { id: ticketId, userEmail: user.email },
		}))
	)
		forbidden();
	const isSubmitted = await database.pendingArticleSubmission.findFirst({
		where: {
			articleDraft: { articleTicketId: ticketId },
		},
	});
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleFormSchema = getArticleFormSchema(t);
	const { title, body } = isSubmitted
		? articleFormSchema.parse({ title: draft.title, body: draft.body })
		: draft;
	const savedDraft = await database.articleDraft.upsert({
		create: {
			articleTicketId: ticketId,
			title,
			body,
		},
		update: {
			title,
			body,
			lastSaved: new Date(),
		},
		where: {
			articleTicketId: ticketId,
		},
	});
	return savedDraft;
}

export async function submitArticle(article: NewArticle, locale?: Language) {
	const { ticketId } = article;
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleFormSchema = getArticleFormSchema(t);
	const { title, body } = articleFormSchema.parse({
		title: article.title,
		body: article.body,
	});
	const { id } = await saveDraft({ ticketId, title, body }, locale);
	await database.pendingArticleSubmission.upsert({
		create: {
			articleDraftId: id,
		},
		update: {},
		where: { articleDraftId: id },
	});
}

export async function createTicket(
	userEmail?: string,
	articleId?: string,
): Promise<{ ticketId: string }> {
	const parsedEmail = userEmail
		? z.email().parse(userEmail.trim())
		: undefined;
	const user = await getUser();
	if (!parsedEmail) {
		await protect({ roles: ["writer"] });
	} else if (parsedEmail === user?.email) {
		await protect({ roles: ["writer"] });
	} else {
		await protect();
	}
	const authorEmail = parsedEmail ?? user!.email;
	const article = articleId
		? await database.article.findUniqueOrThrow({
				include: { author: true },
				where: {
					link: articleId,
				},
			})
		: null;
	if (!article) {
		const ticket = await database.articleTicket.create({
			data: {
				userEmail: authorEmail,
			},
		});
		return { ticketId: ticket.id };
	}
	if (!(article.author.email === authorEmail)) forbidden();
	const ticket = await database.articleTicket.create({
		data: {
			userEmail: authorEmail,
			articleId: article.id,
		},
	});
	return { ticketId: ticket.id };
}

export async function getLatestUnsubmittedDraft() {
	const user = await getUser();
	if (!user) forbidden();
	const draft = await database.articleDraft.findFirst({
		orderBy: {
			lastSaved: "desc",
		},
		include: {
			articleTicket: true,
			pendingArticleSubmission: true,
		},
		where: {
			articleTicket: {
				userEmail: user.email,
			},
			pendingArticleSubmission: null,
		},
	});
	return draft
		? ({
				ticketId: draft.articleTicketId,
				title: draft.title,
				body: draft.body,
			} satisfies NewArticle)
		: null;
}
