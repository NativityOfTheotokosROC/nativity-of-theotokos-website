"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { getTranslations } from "next-intl/server";
import { cacheTag, revalidateTag } from "next/cache";
import { forbidden, notFound } from "next/navigation";
import { ArticleDraft, NewArticleDraft } from "../models/write-article";
import {
	ArticleAuthorWithTranslations,
	ArticleWithTranslations,
	ReplacePropertyType,
} from "../utilities/types";
import {
	_FULL_ARTICLE_INCLUDES,
	validateNewArticle,
} from "../server-only/article";
import { getPlaceholder } from "../server-only/placeholder";
import database from "../third-party/prisma";
import {
	Article,
	ArticleAuthor,
	ArticleTicket,
	Language,
} from "../utilities/types";
import { hasArticleChanged } from "../utilities/article";
import { getMd5Hash, isRemotePath } from "../utilities/miscellaneous";
import { BASE_URL } from "../utilities/server-constants";
import {
	getArticleAuthorSchema,
	NewArticle,
	NewArticleSubmission,
} from "../validation/article";
import { getArticleSubmissionSchema } from "../validation/article";
import { getUser, protect } from "./auth";
import { NewTranslation } from "../validation/utilities";

export async function getArticle(
	articleId: string,
	language: Language,
): Promise<Omit<Article, "url">> {
	"use cache: remote";
	cacheTag(`article_${articleId}`);

	const locale = language;
	try {
		const article = await database.article.findUniqueOrThrow({
			where: { link: articleId },
			include: _FULL_ARTICLE_INCLUDES,
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
				url: article.image.link,
				caption: imageCaption ?? undefined,
				placeholder,
			},
			isArticleFeatured: article.featuredArticle !== null,
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

//TODO: Refactor
export async function getArticleWithTranslations(articleId: string) {
	"use cache: remote";
	cacheTag(`article_${articleId}`);

	try {
		const {
			link,
			title,
			author,
			body,
			snippet,
			dateCreated,
			dateUpdated,
			image,
			featuredArticle,
		} = await database.article.findUniqueOrThrow({
			where: { link: articleId },
			include: _FULL_ARTICLE_INCLUDES,
		});
		const baseUrl = BASE_URL;
		const placeholder =
			(image.placeholder?.placeholder as ImagePlaceholder) ??
			(await getPlaceholder(
				isRemotePath(image.link)
					? image.link
					: `${baseUrl}${image.link}`,
			));
		return {
			uri: image.link,
			title,
			author,
			dateCreated,
			dateUpdated: dateUpdated ?? undefined,
			body,
			snippet,
			articleImage: {
				url: image.link,
				caption: image.caption ?? undefined,
				placeholder,
			},
			isArticleFeatured: featuredArticle !== null,
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

export async function assignArticle(
	email: string,
	options?: Partial<{
		articleId: string;
		useUnused: boolean;
		name: NewTranslation;
		locale: Language;
	}>,
): Promise<{ ticketId: string; canDeleteTicket: boolean }> {
	const user = await protect({ roles: ["editor"] });

	const t = await getTranslations({ locale: options?.locale ?? "en" });
	const assignArticleFormSchema = getArticleAuthorSchema(t);

	const { email: assigneeEmail, name: assigneeName } =
		assignArticleFormSchema.parse({
			email,
			name: options?.name ?? {
				english:
					((
						await database.articleAuthor.findUnique({
							include: { name: true },
							where: {
								email,
							},
						})
					)?.name.english ?? email === user.email)
						? user.name
						: null,
			},
		});

	if (options?.articleId) {
		const article = await database.article.findUniqueOrThrow({
			include: { author: true },
			where: {
				link: options.articleId,
			},
		});
		if (!(article.author.email === assigneeEmail)) forbidden();
		const ticket = options?.useUnused
			? await database.articleTicket.upsert({
					create: {
						assignerEmail: user.email,
						assignee: {
							connectOrCreate: {
								create: {
									name: {
										connectOrCreate: {
											create: {
												...assigneeName,
												englishHash: getMd5Hash(
													assigneeName.english,
												),
											},
											where: {
												englishHash: getMd5Hash(
													assigneeName.english,
												),
											},
										},
									},
									email: assigneeEmail,
								},
								where: { email: assigneeEmail },
							},
						},
						article: {
							connect: {
								link: options.articleId,
							},
						},
					},
					update: {},
					where: { articleId: options.articleId },
				})
			: await database.articleTicket.create({
					data: {
						assignerEmail: user.email,
						assignee: {
							connectOrCreate: {
								create: {
									name: {
										connectOrCreate: {
											create: {
												...assigneeName,
												englishHash: getMd5Hash(
													assigneeName.english,
												),
											},
											where: {
												englishHash: getMd5Hash(
													assigneeName.english,
												),
											},
										},
									},
									email: assigneeEmail,
								},
								where: { email: assigneeEmail },
							},
						},
						article: {
							connect: {
								link: options.articleId,
							},
						},
					},
				});
		revalidateTag("article_authors", "max");
		return {
			ticketId: ticket.id,
			canDeleteTicket: ticket.assigneeEmail === user.email,
		};
	}

	const unusedTicket = options?.useUnused
		? await database.articleTicket.findFirst({
				where: {
					assigneeEmail,
					articleDraft: null,
				},
			})
		: null;
	const ticket =
		unusedTicket ??
		(await database.articleTicket.create({
			data: {
				assignerEmail: user.email,
				assignee: {
					connectOrCreate: {
						create: {
							name: {
								connectOrCreate: {
									create: {
										...assigneeName,
										englishHash: getMd5Hash(
											assigneeName.english,
										),
									},
									where: {
										englishHash: getMd5Hash(
											assigneeName.english,
										),
									},
								},
							},
							email: assigneeEmail,
						},
						where: { email: assigneeEmail },
					},
				},
			},
		}));

	return {
		ticketId: ticket.id,
		canDeleteTicket: ticket.assignerEmail === user.email,
	};
}

export async function deleteTicket(ticketId: string) {
	const user = await getUser();
	if (!user) forbidden();

	const ticket = await database.articleTicket.findUnique({
		where: { id: ticketId },
	});
	if (!ticket) notFound();
	if (ticket.assignerEmail !== user.email)
		await protect({ roles: ["admin"] });

	await database.articleTicket.delete({
		where: {
			id: ticketId,
		},
	});
}

export async function saveDraft(
	ticketId: string,
	draft: NewArticleDraft,
	locale?: Language,
) {
	const user = await getUser();
	if (!user) forbidden();
	const ticket = await database.articleTicket.findUnique({
		where: { id: ticketId },
	});
	if (!ticket) throw new Error("Article ticket does not exist");
	if (ticket.assigneeEmail !== user.email) forbidden();

	const t = await getTranslations({ locale: locale ?? "en" });
	const articleSubmissionSchema = getArticleSubmissionSchema(t);
	const isSubmitted = await database.pendingArticleSubmission.findFirst({
		where: {
			articleDraft: { articleTicketId: ticketId },
		},
	});
	const { title, body } = isSubmitted
		? articleSubmissionSchema.parse(draft)
		: draft;
	const savedDraft = await database.articleDraft.upsert({
		create: {
			articleTicketId: ticketId,
			title: title.english,
			body: body.english,
		},
		update: {
			title: title.english,
			body: body.english,
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
	if (!user) forbidden();

	const ticket = await database.articleTicket.findUnique({
		include: { articleDraft: true },
		where: { id: ticketId },
	});
	if (!ticket) notFound();
	if (ticket.assigneeEmail !== user.email) forbidden();
	if (!ticket.articleDraft) return;

	await database.articleDraft.delete({
		where: {
			articleTicketId: ticketId,
		},
	});
}

export async function submitArticle(
	ticketId: string,
	submission: NewArticleSubmission,
	locale?: Language,
) {
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleSubmissionSchema = getArticleSubmissionSchema(t);
	const { title, body } = articleSubmissionSchema.parse(submission);
	// Auth will be done in here, don't worry
	const { id } = await saveDraft(ticketId, submission, locale);
	await database.pendingArticleSubmission.upsert({
		create: {
			articleDraftId: id,
		},
		update: {},
		where: { articleDraftId: id },
	});
}

export async function makeArticleEdit(articleId: string) {
	const user = await getUser();
	if (!user) forbidden();
	const article = await database.article.findUnique({
		include: _FULL_ARTICLE_INCLUDES,
		where: { link: articleId },
	});
	if (!article) notFound(); // Or maybe throw error?
	if (article.author.email !== user.email)
		await protect({ roles: ["editor"] });

	const ticket = await database.articleTicket.upsert({
		include: { articleDraft: true },
		create: {
			assigneeEmail: user.email,
			assignerEmail: user.email,
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
			title: {
				english: ticket.articleDraft?.title ?? article.title.english,
				russian: article.title.russian ?? undefined,
			},
			body: {
				english: ticket.articleDraft?.body ?? article.body.english,
				russian: article.body.russian ?? undefined,
			},
		},
		canDeleteTicket: true,
		currentArticle: {
			title: article.title,
			author: { name: article.author.name },
			body: article.body,
			snippet: article.snippet,
			dateCreated: article.dateCreated,
			uri: article.link,
			articleImage: {
				url: article.image.link,
				caption: article.image.caption,
				placeholder:
					(article.image.placeholder
						?.placeholder as ImagePlaceholder) ?? undefined,
			},
			isArticleFeatured: article.featuredArticle !== null,
		},
	} satisfies {
		ticketId: string;
		canDeleteTicket: boolean;
		draft: NewArticleDraft;
		currentArticle: ArticleWithTranslations;
	};
}

export async function getDraft(ticketId: string) {
	const user = await getUser();
	if (!user) forbidden();
	const ticket = await database.articleTicket.findUnique({
		include: { articleDraft: true },
		where: { id: ticketId },
	});
	if (!ticket) notFound();
	if (ticket.assigneeEmail !== user.email) forbidden();
	return {
		title: { english: ticket.articleDraft?.title ?? "", russian: null },
		body: { english: ticket.articleDraft?.body ?? "", russian: null },
		lastSaved: ticket.articleDraft?.lastSaved,
	} satisfies ArticleDraft;
}

export async function getLatestUnsubmittedArticle() {
	const user = await getUser();
	if (!user) forbidden();

	const unsubmittedDraftTicket = await database.articleTicket.findFirst({
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
			AND: [
				{ articleDraft: { isNot: null } },
				{
					assigneeEmail: user.email,
					articleDraft: { pendingArticleSubmission: null },
				},
			],
		},
	});

	if (unsubmittedDraftTicket)
		return {
			ticketId: unsubmittedDraftTicket.id,
			canDeleteTicket:
				unsubmittedDraftTicket.assignerEmail === user.email,
			draft: {
				title: {
					english: unsubmittedDraftTicket.articleDraft!.title,
					russian: null,
				},
				body: {
					english: unsubmittedDraftTicket.articleDraft!.body,
					russian: null,
				},
				lastSaved: unsubmittedDraftTicket.articleDraft!.lastSaved,
			},
			currentArticle: unsubmittedDraftTicket.article
				? {
						title: unsubmittedDraftTicket.article.title,
						author: {
							name: unsubmittedDraftTicket.article.author.name,
						},
						body: unsubmittedDraftTicket.article.body,
						snippet: unsubmittedDraftTicket.article.snippet,
						dateCreated: unsubmittedDraftTicket.article.dateCreated,
						uri: unsubmittedDraftTicket.article.link,
						articleImage: {
							url: unsubmittedDraftTicket.article.image.link,
							caption:
								unsubmittedDraftTicket.article.image.caption,
							placeholder:
								(unsubmittedDraftTicket.article.image
									.placeholder
									?.placeholder as ImagePlaceholder) ??
								undefined,
						},
						isArticleFeatured:
							unsubmittedDraftTicket.article.featuredArticle !==
							null,
					}
				: undefined,
		} satisfies {
			ticketId: string;
			canDeleteTicket: boolean;
			draft?: ArticleDraft;
			currentArticle?: ArticleWithTranslations;
		};

	const unusedTicket = await database.articleTicket.findFirst({
		include: {
			article: {
				include: _FULL_ARTICLE_INCLUDES,
			},
		},
		where: {
			assigneeEmail: user.email,
			articleDraft: null,
		},
	});

	if (!unusedTicket) return null;

	const article = unusedTicket.article
		? ({
				title: unusedTicket.article.title,
				author: { name: unusedTicket.article.author.name },
				body: unusedTicket.article.body,
				snippet: unusedTicket.article.snippet,
				dateCreated: unusedTicket.article.dateCreated,
				uri: unusedTicket.article.link,
				articleImage: {
					url: unusedTicket.article.image.link,
					caption: unusedTicket.article.image.caption,
					placeholder:
						(unusedTicket.article.image.placeholder
							?.placeholder as ImagePlaceholder) ?? undefined,
				},
				isArticleFeatured:
					unusedTicket.article.featuredArticle !== null,
			} satisfies ArticleWithTranslations)
		: null;

	return {
		ticketId: unusedTicket.id,
		canDeleteTicket: unusedTicket.assignerEmail === user.email,
		currentArticle: article ?? undefined,
	} satisfies {
		ticketId: string;
		canDeleteTicket: boolean;
		draft?: ArticleDraft;
		currentArticle?: ArticleWithTranslations;
	};
}

export async function getPendingArticleSubmission() {
	const user = await protect({ roles: ["editor"] });
	const ticketData = await database.articleTicket.findFirst({
		include: {
			assignee: { include: { name: true } },
			article: { include: _FULL_ARTICLE_INCLUDES },
			articleDraft: { include: { pendingArticleSubmission: true } },
		},
		where: {
			articleDraft: {
				pendingArticleSubmission: {
					OR: [{ editorEmail: user.email }, { editorEmail: null }],
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
						create: { email: user.email },
						where: { email: user.email },
					},
				},
			},
			where: { articleDraftId: ticketData.articleDraft!.id },
		});
	const assigneeName = ticketData.assignee.name;
	type ArticleTicketWithAssigneeTranslations = ReplacePropertyType<
		ArticleTicket,
		"assignee",
		ArticleAuthorWithTranslations
	>;
	const ticket = {
		ticketId: ticketData.id,
		assignee: { email: ticketData.assigneeEmail, name: assigneeName },
	} satisfies ArticleTicketWithAssigneeTranslations;
	const draft = {
		title: { english: ticketData.articleDraft!.title, russian: null },
		body: { english: ticketData.articleDraft!.body, russian: null },
	} satisfies ArticleDraft;
	const currentArticle = ticketData.article
		? ({
				title: ticketData.article.title,
				author: { name: ticketData.article.author.name },
				body: ticketData.article.body,
				snippet: ticketData.article.snippet,
				dateCreated: ticketData.article.dateCreated,
				uri: ticketData.article.link,
				articleImage: {
					url: ticketData.article.image.link,
					caption: ticketData.article.image.caption,
					placeholder:
						(ticketData.article.image.placeholder
							?.placeholder as ImagePlaceholder) ?? undefined,
				},
				isArticleFeatured: ticketData.article.featuredArticle !== null,
			} satisfies ArticleWithTranslations)
		: undefined;
	return {
		ticket,
		draft,
		currentArticle,
	} satisfies {
		ticket: ArticleTicketWithAssigneeTranslations;
		draft: ArticleDraft;
		currentArticle?: ArticleWithTranslations;
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
	const user = await protect({ roles: ["editor"] });

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
		draft.pendingArticleSubmission.editorEmail &&
		draft.pendingArticleSubmission.editorEmail !== user.email
	)
		forbidden();

	const { link, title, body, snippet, image, isArticleFeatured } =
		await validateNewArticle(incomingArticle, locale);

	const newArticle = database.$transaction(async transaction => {
		const result = await transaction.article.create({
			data: {
				link,
				title: {
					connectOrCreate: {
						create: {
							...title,
							englishHash: getMd5Hash(title.english),
						},
						where: {
							englishHash: getMd5Hash(title.english),
						},
					},
				},
				// TODO: Disable this once there is dedicated article edit place
				author: {
					connect: {
						email: draft.articleTicket.assigneeEmail,
					},
				},
				body: {
					connectOrCreate: {
						create: {
							...body,
							englishHash: getMd5Hash(body.english),
						},
						where: {
							englishHash: getMd5Hash(body.english),
						},
					},
				},
				snippet: {
					connectOrCreate: {
						create: {
							...snippet,
							englishHash: getMd5Hash(snippet.english),
						},
						where: {
							englishHash: getMd5Hash(snippet.english),
						},
					},
				},
				image: {
					connectOrCreate: {
						create: {
							link: image.url,
							caption: {
								connectOrCreate: {
									create: {
										...image.caption,
										englishHash: getMd5Hash(
											image.caption.english,
										),
									},
									where: {
										englishHash: getMd5Hash(
											image.caption.english,
										),
									},
								},
							},
						},
						where: { link: image.url },
					},
				},
			},
		});
		if (isArticleFeatured) {
			await transaction.featuredArticle.deleteMany({});
			await transaction.featuredArticle.create({
				data: { articleId: result.id },
			});
		}
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
	const user = await protect({ roles: ["editor"] });
	const existingArticle = await database.article.findUnique({
		include: _FULL_ARTICLE_INCLUDES,
		where: { link: articleId },
	});
	if (!existingArticle) notFound();

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
			draft.pendingArticleSubmission.editorEmail &&
			draft.pendingArticleSubmission.editorEmail !== user.email
		)
			forbidden();
	}

	const { title, body, snippet, authorName, image, isArticleFeatured } =
		await validateNewArticle(incomingArticle, locale);

	const newArticle = await database.$transaction(async transaction => {
		const result = await transaction.article.update({
			data: {
				// TODO: Watch out, these could balloon in future
				title: {
					connectOrCreate: {
						create: {
							...title,
							englishHash: getMd5Hash(title.english),
						},
						where: {
							englishHash: getMd5Hash(title.english),
						},
					},
				},
				author: authorName
					? {
							update: {
								name: {
									connectOrCreate: {
										create: {
											...authorName,
											englishHash: getMd5Hash(
												authorName.english,
											),
										},
										where: {
											englishHash: getMd5Hash(
												authorName.english,
											),
										},
									},
								},
							},
						}
					: undefined,
				body: {
					connectOrCreate: {
						create: {
							...body,
							englishHash: getMd5Hash(body.english),
						},
						where: {
							englishHash: getMd5Hash(body.english),
						},
					},
				},
				snippet: {
					connectOrCreate: {
						create: {
							...snippet,
							englishHash: getMd5Hash(snippet.english),
						},
						where: {
							englishHash: getMd5Hash(snippet.english),
						},
					},
				},
				image: {
					connectOrCreate: {
						create: {
							link: image.url,
							caption: {
								connectOrCreate: {
									create: {
										...image.caption,
										englishHash: getMd5Hash(
											image.caption.english,
										),
									},
									where: {
										englishHash: getMd5Hash(
											image.caption.english,
										),
									},
								},
							},
						},
						where: { link: image.url },
					},
				},
				dateUpdated: hasArticleChanged(
					{
						title: existingArticle.title,
						author: { name: existingArticle.author.name },
						snippet: existingArticle.snippet,
						body: existingArticle.body,
						articleImage: {
							url: existingArticle.image.link,
							caption: existingArticle.image.caption,
						},
					},
					incomingArticle,
				)
					? new Date()
					: undefined,
			},
			where: {
				link: articleId, // TODO: Change articleId to articleLink in future to avoid confusion
			},
		});
		if (isArticleFeatured) {
			await transaction.featuredArticle.deleteMany({});
			await transaction.featuredArticle.create({
				data: { articleId: result.id },
			});
		}
		if (ticketId)
			await transaction.articleTicket.delete({ where: { id: ticketId } });
		return result;
	});
	revalidateTag("latest-articles", "max");
	revalidateTag(`article_${articleId}`, "max");
	return newArticle;
}
