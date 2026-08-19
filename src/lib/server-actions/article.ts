"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { getTranslations } from "next-intl/server";
import { cacheTag, revalidateTag } from "next/cache";
import { forbidden, notFound } from "next/navigation";
import z from "zod";
import { ArticleDraft } from "../models/write-article";
import { getPlaceholder } from "../server-only/placeholder";
import database from "../third-party/prisma";
import {
	Article,
	ArticleAuthor,
	ArticleTicket,
	Language,
	NewArticle,
} from "../types/general";
import {
	getMd5Hash,
	isRemotePath,
	removeMarkup,
} from "../utilities/miscellaneous";
import { BASE_URL, IS_AUTH_DISABLED } from "../utilities/server-constants";
import { getWriteArticleFormSchema } from "../validation/write-article-form";
import { getUser, protect } from "./auth";
import { getUserInformation } from "./user";
import {
	getPublishArticleFormSchema,
	MAX_SNIPPET,
} from "../validation/publish-article-form";
import { DEFAULT_PREVIEW_USER_EMAIL } from "../utilities/constants";
import { link } from "fs";
import { title } from "process";
import { validateNewArticle } from "../server-only/article";

const _FULL_ARTICLE_INCLUDES = {
	author: { include: { name: true } },
	title: true,
	body: true,
	snippet: true,
	image: { include: { placeholder: true, caption: true } },
};

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

export async function saveDraft(
	ticketId: string,
	draft: ArticleDraft,
	locale?: Language,
) {
	const user = await getUser();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const ticket = await database.articleTicket.findUnique({
		where: { id: ticketId },
	});
	if (!ticket) notFound(); // TODO: Throw error instead
	if (user && ticket.userEmail !== user.email) forbidden();
	const isSubmitted = await database.pendingArticleSubmission.findFirst({
		where: {
			articleDraft: { articleTicketId: ticketId },
		},
	});
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleFormSchema = getWriteArticleFormSchema(t);
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

export async function discardDraft(ticketId: string) {
	const user = await getUser();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const ticket = await database.articleTicket.findUnique({
		include: { articleDraft: true },
		where: { id: ticketId },
	});
	if (!ticket) notFound();
	if (user && ticket.userEmail !== user.email) forbidden();
	if (!ticket.articleDraft) return;

	await database.articleDraft.delete({
		where: {
			articleTicketId: ticketId,
		},
	});
}

export async function deleteTicket(ticketId: string) {
	const user = await getUser();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const ticket = await database.articleTicket.findUnique({
		where: { id: ticketId },
	});
	if (!ticket) notFound();
	if (user && ticket.assignerEmail !== user.email)
		await protect({ roles: ["admin"] });

	await database.articleTicket.delete({
		where: {
			id: ticketId,
		},
	});
}

export async function submitArticle(
	ticketId: string,
	article: ArticleDraft,
	locale?: Language,
) {
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleFormSchema = getWriteArticleFormSchema(t);
	const { title, body } = articleFormSchema.parse({
		title: article.title,
		body: article.body,
	});
	const { id } = await saveDraft(ticketId, { title, body }, locale);
	await database.pendingArticleSubmission.upsert({
		create: {
			articleDraftId: id,
		},
		update: {},
		where: { articleDraftId: id },
	});
}

// TODO: Sloppy function. Refactor
export async function createTicket(
	options?: Partial<{
		userEmail: string;
		articleId: string;
		useUnused: boolean;
	}>,
): Promise<{ ticketId: string; canDeleteTicket: boolean }> {
	const parsedEmail = options?.userEmail
		? z.email().parse(options.userEmail.trim())
		: null;
	const user = await getUser();
	if (!parsedEmail) {
		await protect({ roles: ["writer"] });
	} else if (user && user.email === parsedEmail) {
		await protect({ roles: ["writer"] });
	} else {
		await protect({ roles: ["admin"] });
	}
	const userEmail = user?.email ?? DEFAULT_PREVIEW_USER_EMAIL;
	const authorEmail = parsedEmail ?? userEmail;

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
					assignerEmail: userEmail,
				},
			}));
		return {
			ticketId: ticket.id,
			canDeleteTicket: ticket.assignerEmail === userEmail,
		};
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
				assignerEmail: userEmail,
				articleId: article.link,
			},
		}));
	return {
		ticketId: ticket.id,
		canDeleteTicket: ticket.assignerEmail === userEmail,
	};
}

export async function makeArticleEdit(articleId: string) {
	const user = await getUserInformation();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const article = await database.article.findUnique({
		include: _FULL_ARTICLE_INCLUDES,
		where: { link: articleId },
	});
	if (!article) notFound();
	if (!IS_AUTH_DISABLED && user?.email !== article.author.email)
		await protect({ roles: ["admin"] });
	const userEmail = user?.email ?? DEFAULT_PREVIEW_USER_EMAIL;

	const ticket = await database.articleTicket.upsert({
		include: { articleDraft: true },
		create: {
			userEmail,
			assignerEmail: userEmail,
			articleId,
			articleDraft: {
				create: {
					title: article.title.english,
					body: article.body.english,
					lastSaved: new Date(),
				},
			},
		},
		update: {},
		where: { articleId },
	});
	return {
		ticketId: ticket.id,
		draft: {
			title: ticket.articleDraft?.title ?? article.title.english,
			body: ticket.articleDraft?.body ?? article.body.english,
		},
		canDeleteTicket: true,
		currentArticle: {
			title: article.title.english,
			author: { name: article.author.name.english },
			body: article.body.english,
			snippet: article.snippet.english,
			dateCreated: article.dateCreated,
			uri: article.link,
			articleImage: {
				source: article.image.link,
				about: article.image.caption.english,
				placeholder:
					(article.image.placeholder
						?.placeholder as ImagePlaceholder) ?? undefined,
			},
		},
	} satisfies {
		ticketId: string;
		canDeleteTicket: boolean;
		draft: ArticleDraft;
		currentArticle: Article;
	};
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
		title: ticket.articleDraft?.title ?? "",
		body: ticket.articleDraft?.body ?? "",
	} satisfies ArticleDraft;
}

export async function getLatestUnsubmittedArticle() {
	const user = await getUser();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const userEmail = user?.email ?? DEFAULT_PREVIEW_USER_EMAIL;

	const ticket = await database.articleTicket.findFirst({
		orderBy: {
			articleDraft: { lastSaved: "desc" },
		},
		include: {
			article: {
				include: _FULL_ARTICLE_INCLUDES,
			},
			articleDraft: true,
		},
		where: {
			OR: [
				{ userEmail, articleDraft: null },
				{
					userEmail,
					articleDraft: { pendingArticleSubmission: null },
				},
			],
		},
	});

	if (!ticket) return null;

	const articleDraft = ticket.articleDraft
		? ({
				title: ticket.articleDraft.title,
				body: ticket.articleDraft.body,
			} satisfies ArticleDraft)
		: null;

	const article = ticket.article
		? ({
				title: ticket.article.title.english,
				author: { name: ticket.article.author.name.english },
				body: ticket.article.body.english,
				snippet: ticket.article.snippet.english,
				dateCreated: ticket.article.dateCreated,
				uri: ticket.article.link,
				articleImage: {
					source: ticket.article.image.link,
					about: ticket.article.image.caption.english,
					placeholder:
						(ticket.article.image.placeholder
							?.placeholder as ImagePlaceholder) ?? undefined,
				},
			} satisfies Article)
		: null;

	return {
		ticketId: ticket.id,
		canDeleteTicket: ticket.assignerEmail === userEmail,
		draft: articleDraft ?? undefined,
		currentArticle: article ?? undefined,
	} satisfies {
		ticketId: string;
		canDeleteTicket: boolean;
		draft?: ArticleDraft;
		currentArticle?: Article;
	};
}

export async function getPendingArticleSubmission() {
	const user = await getUser();
	if (!IS_AUTH_DISABLED && !user) forbidden();
	if (!IS_AUTH_DISABLED) await protect({ roles: ["admin"] });
	const userEmail = user?.email ?? DEFAULT_PREVIEW_USER_EMAIL;
	const ticketData = await database.articleTicket.findFirst({
		include: {
			article: { include: _FULL_ARTICLE_INCLUDES },
			articleDraft: { include: { pendingArticleSubmission: true } },
		},
		where: {
			articleDraft: {
				pendingArticleSubmission: IS_AUTH_DISABLED
					? { isNot: null }
					: {
							OR: [
								{ editorEmail: user?.email },
								{ editorEmail: null },
							],
						},
			},
		},
	});
	if (!ticketData) return null;
	if (
		!ticketData.articleDraft!.pendingArticleSubmission!.editorEmail === null
	)
		await database.pendingArticleSubmission.update({
			data: {
				assignedEditor: {
					connectOrCreate: {
						create: { email: userEmail },
						where: { email: userEmail },
					},
				},
			},
			where: { articleDraftId: ticketData.articleDraft!.id },
		});
	const assigneeName =
		(
			await database.articleAuthor.findUnique({
				include: { name: true },
				where: { email: ticketData.userEmail },
			})
		)?.name.english ??
		(ticketData.userEmail === user?.email ? user.name : undefined) ??
		(
			await database.user.findUnique({
				where: { email: ticketData.userEmail },
			})
		)?.name;
	const ticket = {
		ticketId: ticketData.id,
		assignee: { email: ticketData.userEmail, name: assigneeName },
	} satisfies ArticleTicket;
	const draft = {
		title: ticketData.articleDraft!.title,
		body: ticketData.articleDraft!.body,
	} satisfies ArticleDraft;
	const currentArticle = ticketData.article
		? ({
				title: ticketData.article.title.english,
				author: { name: ticketData.article.author.name.english },
				body: ticketData.article.body.english,
				snippet: ticketData.article.snippet.english,
				dateCreated: ticketData.article.dateCreated,
				uri: ticketData.article.link,
				articleImage: {
					source: ticketData.article.image.link,
					about: ticketData.article.image.caption.english,
					placeholder:
						(ticketData.article.image.placeholder
							?.placeholder as ImagePlaceholder) ?? undefined,
				},
			} satisfies Article)
		: undefined;
	return {
		ticket,
		draft,
		currentArticle,
	} satisfies {
		ticket: ArticleTicket;
		draft: ArticleDraft;
		currentArticle?: Article;
	};
}

export async function publishNewArticle({
	incomingArticle,
	ticketId,
	locale,
}: {
	incomingArticle: NewArticle;
	ticketId: string;
	locale?: Language;
}) {
	const user = await getUser();
	if (!IS_AUTH_DISABLED && !user) forbidden();
	if (!IS_AUTH_DISABLED) await protect({ roles: ["admin", "editor"] });
	const userEmail = user?.email ?? DEFAULT_PREVIEW_USER_EMAIL;

	const draft = await database.articleDraft.findUnique({
		include: {
			pendingArticleSubmission: true,
			articleTicket: true,
		},
		where: { articleTicketId: ticketId },
	});
	if (!draft) notFound();
	if (!draft.pendingArticleSubmission) forbidden();
	if (
		!IS_AUTH_DISABLED &&
		draft.pendingArticleSubmission.editorEmail &&
		draft.pendingArticleSubmission.editorEmail !== userEmail
	)
		forbidden();

	const {
		link,
		title,
		body,
		snippet,
		authorName,
		articleImage: { source, about },
	} = await validateNewArticle(incomingArticle, locale);

	const newArticle = database.$transaction(async transaction => {
		const result = await transaction.article.create({
			data: {
				link,
				title: {
					connectOrCreate: {
						create: {
							english: title,
							englishHash: getMd5Hash(title),
						},
						where: {
							englishHash: getMd5Hash(title),
						},
					},
				},
				author: {
					connectOrCreate: {
						create: {
							email: draft.articleTicket.userEmail,
							name: {
								connectOrCreate: {
									create: {
										english: authorName,
										englishHash: getMd5Hash(authorName),
									},
									where: {
										englishHash: getMd5Hash(authorName),
									},
								},
							},
						},
						where: {
							email: draft.articleTicket.userEmail,
						},
					},
				},
				body: {
					connectOrCreate: {
						create: {
							english: body,
							englishHash: getMd5Hash(body),
						},
						where: {
							englishHash: getMd5Hash(body),
						},
					},
				},
				snippet: {
					connectOrCreate: {
						create: {
							english: snippet,
							englishHash: getMd5Hash(snippet),
						},
						where: {
							englishHash: getMd5Hash(snippet),
						},
					},
				},
				image: {
					connectOrCreate: {
						create: {
							link: source,
							caption: {
								connectOrCreate: {
									create: {
										english: about,
										englishHash: getMd5Hash(about),
									},
									where: {
										englishHash: getMd5Hash(about),
									},
								},
							},
						},
						where: { link: source },
					},
				},
			},
		});
		await transaction.articleTicket.delete({ where: { id: ticketId } });
		return result;
	});
	revalidateTag("latest-articles", "max");
	return newArticle;
}

export async function publishExistingArticle({
	articleId,
	incomingArticle,
	ticketId,
	locale,
}: {
	articleId: string;
	incomingArticle: NewArticle;
	ticketId?: string;
	locale?: Language;
}) {
	const user = await getUser();
	if (!IS_AUTH_DISABLED && !user) forbidden();
	if (!IS_AUTH_DISABLED) await protect({ roles: ["admin", "editor"] });
	const userEmail = user?.email ?? DEFAULT_PREVIEW_USER_EMAIL;

	if (
		!(await database.article.findUnique({
			where: { link: articleId },
		}))
	)
		notFound();

	const draft = ticketId
		? await database.articleDraft.findUnique({
				include: {
					pendingArticleSubmission: true,
					articleTicket: true,
				},
				where: {
					articleTicketId: ticketId,
					articleTicket: { articleId },
				},
			})
		: null;
	if (draft) {
		if (!draft.pendingArticleSubmission) forbidden();
		if (
			!IS_AUTH_DISABLED &&
			draft.pendingArticleSubmission.editorEmail &&
			draft.pendingArticleSubmission.editorEmail !== userEmail
		)
			forbidden();
	}

	const {
		title,
		body,
		snippet,
		authorName,
		articleImage: { source, about },
	} = await validateNewArticle(incomingArticle, locale);

	const newArticle = await database.$transaction(async transaction => {
		const result = await transaction.article.update({
			data: {
				// TODO: Watch out, these could balloon in future
				title: {
					connectOrCreate: {
						create: {
							english: title,
							englishHash: getMd5Hash(title),
						},
						where: {
							englishHash: getMd5Hash(title),
						},
					},
				},
				author: {
					update: {
						name: {
							connectOrCreate: {
								create: {
									english: authorName,
									englishHash: getMd5Hash(authorName),
								},
								where: {
									englishHash: getMd5Hash(authorName),
								},
							},
						},
					},
				},
				body: {
					connectOrCreate: {
						create: {
							english: body,
							englishHash: getMd5Hash(body),
						},
						where: {
							englishHash: getMd5Hash(body),
						},
					},
				},
				snippet: {
					connectOrCreate: {
						create: {
							english: snippet,
							englishHash: getMd5Hash(snippet),
						},
						where: {
							englishHash: getMd5Hash(snippet),
						},
					},
				},
				image: {
					connectOrCreate: {
						create: {
							link: source,
							caption: {
								connectOrCreate: {
									create: {
										english: about,
										englishHash: getMd5Hash(about),
									},
									where: {
										englishHash: getMd5Hash(about),
									},
								},
							},
						},
						where: { link: source },
					},
				},
				dateUpdated: new Date(),
			},
			where: {
				link: articleId, // TODO: Change articleId to articleLink in future to avoid confusion
			},
		});
		if (ticketId)
			await transaction.articleTicket.delete({ where: { id: ticketId } });
		return result;
	});
	revalidateTag("latest-articles", "max");
	revalidateTag(`article_${articleId}`, "max");
	console.log(`Success? ${JSON.stringify(newArticle)}`);
	return newArticle;
}
