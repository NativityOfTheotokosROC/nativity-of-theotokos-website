"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { getTranslations } from "next-intl/server";
import { cacheTag, revalidateTag } from "next/cache";
import { forbidden, notFound } from "next/navigation";
import z from "zod";
import { ArticleDraft } from "../models/edit-article";
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
import { getEditArticleFormSchema } from "../validation/edit-article-form";
import { getUser, protect } from "./auth";
import { getUserInformation } from "./user";
import { getPublishArticleFormSchema } from "../validation/publish-article-form";

const FULL_ARTICLE_INCLUDES = {
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

export async function submitArticle(
	ticketId: string,
	article: ArticleDraft,
	locale?: Language,
) {
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleFormSchema = getEditArticleFormSchema(t);
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
		await protect({ roles: ["admin"] });
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
	const user = await getUserInformation();
	if (!user && !IS_AUTH_DISABLED) forbidden();
	const article = await database.article.findUnique({
		include: FULL_ARTICLE_INCLUDES,
		where: { link: articleId },
	});
	if (!article) notFound();
	if (!IS_AUTH_DISABLED && user?.email !== article.author.email)
		await protect({ roles: ["admin"] });
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
		draft: {
			title: ticket.articleDraft?.title ?? article.title.english,
			body: ticket.articleDraft?.body ?? article.body.english,
		},
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

export async function getLatestUnsubmittedArticle(authorEmail?: string) {
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

	const ticket = await database.articleTicket.findFirst({
		orderBy: {
			articleDraft: { lastSaved: "desc" },
		},
		include: {
			article: {
				include: FULL_ARTICLE_INCLUDES,
			},
			articleDraft: true,
		},
		where: {
			userEmail,
			articleDraft: { pendingArticleSubmission: null },
		},
	});

	if (!ticket) return null;

	const articleDraft = ticket.articleDraft
		? ({
				title: ticket.articleDraft.title,
				body: ticket.articleDraft.body,
			} satisfies ArticleDraft)
		: undefined;

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
		: undefined;

	return {
		ticketId: ticket.id,
		draft: articleDraft,
		currentArticle: article,
	} satisfies {
		ticketId: string;
		draft?: ArticleDraft;
		currentArticle?: Article;
	};
}

export async function getPendingArticleSubmission() {
	const user = await getUser();
	if (!IS_AUTH_DISABLED && !user) forbidden();
	if (!IS_AUTH_DISABLED) await protect({ roles: ["admin"] });
	const ticketData = await database.articleTicket.findFirst({
		include: {
			article: { include: FULL_ARTICLE_INCLUDES },
			articleDraft: { include: { pendingArticleSubmission: true } },
		},
		where: {
			articleDraft: {
				pendingArticleSubmission: IS_AUTH_DISABLED
					? { isNot: null }
					: {
							editorEmail: user?.email ?? null,
						},
			},
		},
	});
	if (!ticketData) return null;
	if (
		!ticketData.articleDraft!.pendingArticleSubmission!.editorEmail ===
			null &&
		!IS_AUTH_DISABLED
	)
		await database.pendingArticleSubmission.update({
			data: { assignedEditor: { connect: { email: user!.email } } },
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

export async function publishArticle(
	ticketId: string,
	article: NewArticle,
	locale?: Language,
) {
	const user = await getUser();
	if (!IS_AUTH_DISABLED && !user) forbidden();
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
		draft.pendingArticleSubmission.editorEmail !== user?.email
	)
		await protect({ roles: ["admin"] }); //TODO: Implement new roles management idea

	const t = await getTranslations({ locale: locale ?? "en" });
	const publishArticleFormSchema = getPublishArticleFormSchema(t);
	const { title, body, authorName, imageUrl, imageCaption, snippet } =
		publishArticleFormSchema.parse({
			title: article.title,
			body: article.body,
			authorName: article.authorName,
			snippet: article.snippet ?? "",
			imageUrl: article.articleImage.source,
			imageCaption: article.articleImage.about,
		} satisfies z.infer<typeof publishArticleFormSchema>);
	const link = z.string().slugify().parse(title);
	const finalSnippet = snippet ?? removeMarkup(body.split("</p>")[0]);

	const newArticle = await database.$transaction(async transaction => {
		const result = draft.articleTicket.articleId
			? await transaction.article.update({
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
									english: finalSnippet,
									englishHash: getMd5Hash(finalSnippet),
								},
								where: {
									englishHash: getMd5Hash(finalSnippet),
								},
							},
						},
						image: {
							connectOrCreate: {
								create: {
									link: imageUrl,
									caption: {
										connectOrCreate: {
											create: {
												english: imageCaption,
												englishHash:
													getMd5Hash(imageCaption),
											},
											where: {
												englishHash:
													getMd5Hash(imageCaption),
											},
										},
									},
								},
								where: { link: imageUrl },
							},
						},
						dateUpdated: new Date(),
					},
					where: {
						link: draft.articleTicket.articleId, // TODO: Change articleId to articleLink in future to avoid confusion
					},
				})
			: await transaction.article.create({
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
												englishHash:
													getMd5Hash(authorName),
											},
											where: {
												englishHash:
													getMd5Hash(authorName),
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
									english: finalSnippet,
									englishHash: getMd5Hash(finalSnippet),
								},
								where: {
									englishHash: getMd5Hash(finalSnippet),
								},
							},
						},
						image: {
							connectOrCreate: {
								create: {
									link: imageUrl,
									caption: {
										connectOrCreate: {
											create: {
												english: imageCaption,
												englishHash:
													getMd5Hash(imageCaption),
											},
											where: {
												englishHash:
													getMd5Hash(imageCaption),
											},
										},
									},
								},
								where: { link: imageUrl },
							},
						},
					},
				});
		await transaction.articleTicket.delete({ where: { id: ticketId } });
		return result;
	});
	revalidateTag("latest-articles", "max");
	if (draft.articleTicket.articleId)
		revalidateTag(`article_${draft.articleTicket.articleId}`, "max");
	return newArticle;
}
