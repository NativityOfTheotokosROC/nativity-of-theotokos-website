"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { getTranslations } from "next-intl/server";
import { cacheTag } from "next/cache";
import { forbidden, notFound } from "next/navigation";
import z from "zod";
import { ArticleDraft } from "../models/new-article";
import { getPlaceholder } from "../server-only/placeholder";
import database from "../third-party/prisma";
import { Article, ArticleAuthor, Language } from "../types/general";
import { isRemotePath } from "../utilities/miscellaneous";
import { BASE_URL, IS_AUTH_DISABLED } from "../utilities/server-constants";
import { getEditArticleFormSchema } from "../validation/edit-article-form";
import { getUser, protect } from "./auth";

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
		const author = {
			name:
				locale === "ru" && article.author.name.russian != null
					? article.author.name.russian
					: article.author.name.english,
			email: article.author.email ?? undefined,
		} satisfies ArticleAuthor;
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

export async function saveDraft(draft: ArticleDraft, locale?: Language) {
	const { ticketId } = draft;
	const user = await getUser();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const ticket = await database.articleTicket.findUnique({
		where: { id: ticketId },
	});
	if (!ticket) forbidden(); // TODO: Throw error instead
	if (user && ticket.userEmail !== user.email) forbidden();
	const isSubmitted = await database.pendingArticleSubmission.findFirst({
		where: {
			articleDraft: { articleTicketId: ticketId },
		},
	});
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleFormSchema = getEditArticleFormSchema(t);
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

export async function submitArticle(article: ArticleDraft, locale?: Language) {
	const { ticketId } = article;
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleFormSchema = getEditArticleFormSchema(t);
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
	options?: Partial<{
		userEmail: string;
		articleId: string;
		useUnused: boolean;
	}>,
): Promise<{ ticketId: string }> {
	const parsedEmail = options?.userEmail
		? z.email().parse(options.userEmail.trim())
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
	const article = options?.articleId
		? await database.article.findUniqueOrThrow({
				include: { author: true },
				where: {
					link: options.articleId,
				},
			})
		: null;
	if (!article) {
		const unusedTicket = options?.useUnused
			? await database.articleTicket.findFirst({
					where: {
						userEmail: authorEmail,
						articleDraft: null,
					},
				})
			: null;
		const ticket =
			unusedTicket ??
			(await database.articleTicket.create({
				data: {
					userEmail: authorEmail,
				},
			}));
		return { ticketId: ticket.id };
	}
	if (!(article.author.email === authorEmail)) forbidden();
	const unusedTicket = options?.useUnused
		? await database.articleTicket.findFirst({
				where: {
					userEmail: authorEmail,
					articleDraft: null,
					articleId: article.link,
				},
			})
		: null;
	const ticket =
		unusedTicket ??
		(await database.articleTicket.create({
			data: {
				userEmail: authorEmail,
				articleId: article.link,
			},
		}));
	return { ticketId: ticket.id };
}

export async function makeArticleEdit(articleId: string) {
	const user = await getUser();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const article = await database.article.findUnique({
		include: { author: true, title: true, body: true },
		where: { link: articleId },
	});
	if (!article) notFound();
	if (!IS_AUTH_DISABLED && user?.email !== article.author.email) forbidden();
	const ticket = await database.articleTicket.upsert({
		include: { articleDraft: true },
		create: {
			userEmail: user?.email ?? "editorial@nativityoftheotokos.com",
			articleId,
			articleDraft: {
				create: {
					title: article.title.english,
					body: article.body.english,
				},
			},
		},
		update: {},
		where: { articleId },
	});
	return {
		ticketId: ticket.id,
		title: ticket.articleDraft?.title ?? article.title.english,
		body: ticket.articleDraft?.body ?? article.body.english,
	} satisfies ArticleDraft;
}

export async function getDraft(ticketId: string) {
	const user = await getUser();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const ticket = await database.articleTicket.findUnique({
		include: { articleDraft: true },
		where: { id: ticketId },
	});
	if (!ticket) notFound();
	if (!IS_AUTH_DISABLED && user?.email !== ticket.userEmail) forbidden();
	return {
		ticketId,
		title: ticket.articleDraft?.title ?? "",
		body: ticket.articleDraft?.body ?? "",
	} satisfies ArticleDraft;
}

export async function getLatestUnsubmittedDraft(authorEmail?: string) {
	const parsedEmail = authorEmail
		? z.email().parse(authorEmail.trim())
		: undefined;
	const user = await getUser();
	if (!(parsedEmail || user?.email) && IS_AUTH_DISABLED)
		throw new Error("Not logged in and no email provided.");
	if (!(parsedEmail || user?.email)) forbidden();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	if (parsedEmail && parsedEmail !== user?.email) await protect();

	const userEmail = parsedEmail ?? user!.email;

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
				userEmail,
			},
			pendingArticleSubmission: null,
		},
	});

	return draft
		? ({
				ticketId: draft.articleTicketId,
				title: draft.title,
				body: draft.body,
			} satisfies ArticleDraft)
		: null;
}
