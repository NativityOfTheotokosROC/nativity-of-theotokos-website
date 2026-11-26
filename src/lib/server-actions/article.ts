"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { newReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";
import { forbidden, notFound } from "next/navigation";
import { after } from "next/server";
import z from "zod";
import ArticlePublished from "../components/email-templates/article-published/ArticlePublished";
import ArticleRescheduled from "../components/email-templates/article-rescheduled/ArticleRescheduled";
import ArticleScheduled from "../components/email-templates/article-scheduled/ArticleScheduled";
import AuthorInvite from "../components/email-templates/author-invite/AuthorInvite";
import { ArticleDraft, NewArticleDraft } from "../models/write-article";
import {
	_FULL_ARTICLE_INCLUDES,
	getArticle,
	getFeaturedArticle,
} from "../server-only/article";
import { getPlaceholder } from "../server-only/placeholder";
import database from "../third-party/prisma";
import resend from "../third-party/resend";
import { hasArticleChanged } from "../utilities/article";
import { MAILING_ADDRESS } from "../utilities/constants";
import {
	pickFullDateTranslation,
	pickFullTimeTranslation,
} from "../utilities/date-time";
import { isValidLocale } from "../utilities/internationalization";
import {
	getMd5Hash,
	pickTranslation,
	removeMarkup,
	snippetify,
} from "../utilities/miscellaneous";
import { BASE_URL, SENDER_EMAIL } from "../utilities/server-constants";
import {
	ArticleAuthor,
	ArticleAuthorWithTranslations,
	ArticleTicket,
	ArticleWithTranslations,
	Language,
	ReplacePropertyType,
	Translation,
} from "../utilities/types";
import {
	getArticleAuthorSchema,
	getArticleSchema,
	getArticleSubmissionSchema,
	MAX_SNIPPET,
	NewArticle,
	NewArticleAuthor,
	NewArticleSubmission,
} from "../validation/article";
import { NewTranslation } from "../validation/utilities";
import { getUser, protect } from "./auth";
import { getUserInformation } from "./user";

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
	const language = options?.locale ?? "en";
	const t = await getTranslations({ locale: language });
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
		const isSelfAssigned = ticket.assigneeEmail === user.email;
		return {
			ticketId: ticket.id,
			canDeleteTicket: isSelfAssigned,
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
	const isSelfAssigned = ticket.assigneeEmail === user.email;
	if (!isSelfAssigned)
		after(async () => {
			const { data, error: contactError } = await resend.contacts.get({
				email: assigneeEmail,
			});
			const preferredLanguage = isValidLocale(
				data?.properties.preferredLang.value,
			)
				? data.properties.preferredLang.value
				: "en";
			const t = await getTranslations({ locale: preferredLanguage });
			const { error: sendingError } = await resend.emails.send({
				from: `${t("miscellaneous.churchName")} <${SENDER_EMAIL}>`,
				to: [
					`${data?.first_name ?? pickTranslation(assigneeName, preferredLanguage)} <${assigneeEmail}>`,
				],
				replyTo: MAILING_ADDRESS,
				subject: t("authorInvite.title"),
				react: AuthorInvite({
					model: newReadonlyModel({
						language: preferredLanguage,
						author: {
							email: assigneeEmail,
							name:
								data?.first_name ??
								pickTranslation(
									assigneeName,
									preferredLanguage,
								),
						},
						articleLink: `${BASE_URL}/write-article`,
					}),
				}),
			});
			if (sendingError) console.error(JSON.stringify(sendingError));
			if (contactError) console.error(JSON.stringify(contactError));
		});

	return {
		ticketId: ticket.id,
		canDeleteTicket: isSelfAssigned,
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
	const validatedSubmission = articleSubmissionSchema.parse(submission);
	// Auth will be done in here, don't worry
	const { id } = await saveDraft(ticketId, validatedSubmission, locale);
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

	const featuredArticlePromise = getFeaturedArticle(undefined, true);
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
			author: {
				id: article.author.id,
				uri: article.author.uri,
				name: article.author.name,
			},
			body: article.body,
			snippet: article.snippet,
			datePublished: article.datePublished,
			uri: article.link,
			articleImage: {
				url: article.image.link,
				caption: article.image.caption,
				placeholder:
					(article.image.placeholder
						?.placeholder as ImagePlaceholder) ?? undefined,
			},
			isArticleFeatured:
				(await featuredArticlePromise)?.uri === article.link,
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

	const featuredArticlePromise = getFeaturedArticle(undefined, true);
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
							id: unsubmittedDraftTicket.article.author.id,
							uri: unsubmittedDraftTicket.article.author.uri,
							name: unsubmittedDraftTicket.article.author.name,
						},
						body: unsubmittedDraftTicket.article.body,
						snippet: unsubmittedDraftTicket.article.snippet,
						datePublished:
							unsubmittedDraftTicket.article.datePublished,
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
							unsubmittedDraftTicket.article.link ===
							(await featuredArticlePromise)?.uri,
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
				author: {
					id: unusedTicket.article.author.id,
					uri: unusedTicket.article.author.uri,
					name: unusedTicket.article.author.name,
				},
				body: unusedTicket.article.body,
				snippet: unusedTicket.article.snippet,
				datePublished: unusedTicket.article.datePublished,
				uri: unusedTicket.article.link,
				articleImage: {
					url: unusedTicket.article.image.link,
					caption: unusedTicket.article.image.caption,
					placeholder:
						(unusedTicket.article.image.placeholder
							?.placeholder as ImagePlaceholder) ?? undefined,
				},
				isArticleFeatured:
					unusedTicket.article.link ===
					(await featuredArticlePromise)?.uri,
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
	const featuredArticlePromise = getFeaturedArticle(undefined, true);
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
		ArticleAuthor<Translation>
	>;
	const ticket = {
		ticketId: ticketData.id,
		// TODO: Stinky. Address later
		assignee: {
			id: ticketData.assignee.id,
			uri: ticketData.assignee.uri,
			email: ticketData.assigneeEmail,
			name: assigneeName,
		},
	} satisfies ArticleTicketWithAssigneeTranslations;
	const draft = {
		title: { english: ticketData.articleDraft!.title, russian: null },
		body: { english: ticketData.articleDraft!.body, russian: null },
	} satisfies ArticleDraft;
	const currentArticle = ticketData.article
		? ({
				title: ticketData.article.title,
				author: {
					id: ticketData.article.author.id,
					uri: ticketData.article.author.uri,
					name: ticketData.article.author.name,
				},
				body: ticketData.article.body,
				snippet: ticketData.article.snippet,
				datePublished: ticketData.article.datePublished,
				uri: ticketData.article.link,
				articleImage: {
					url: ticketData.article.image.link,
					caption: ticketData.article.image.caption,
					placeholder:
						(ticketData.article.image.placeholder
							?.placeholder as ImagePlaceholder) ?? undefined,
				},
				isArticleFeatured:
					ticketData.article.link ===
					(await featuredArticlePromise)?.uri,
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
			articleTicket: {
				include: { assignee: { include: { name: true } } },
			},
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

	const {
		link,
		title,
		body,
		snippet,
		image,
		isArticleFeatured,
		publishingDate,
	} = await _validateNewArticle(incomingArticle, locale);
	const placeholder = await getPlaceholder(image.url);

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
							placeholder: {
								connectOrCreate: {
									create: {
										imageLink: image.url,
										placeholder,
									},
									where: {
										imageLink: image.url,
									},
								},
							},
						},
						where: { link: image.url },
					},
				},
				datePublished: publishingDate
					? new Date(publishingDate)
					: undefined,
			},
		});
		if (isArticleFeatured) {
			await transaction.featuredArticle.upsert({
				create: { articleId: result.id },
				update: { dateFeatured: new Date() },
				where: { articleId: result.id },
			});
		}
		await transaction.articleTicket.delete({ where: { id: ticketId } });
		return result;
	});
	revalidateTag("latest-articles", "max");
	after(async () => {
		const recipientEmail = draft.articleTicket.assigneeEmail;
		const contact = await resend.contacts.get({
			email: recipientEmail,
		});
		const preferredLanguage =
			(contact.data?.properties.preferredLang.value as Language) ?? "en";
		const recipientName =
			contact.data?.first_name ??
			pickTranslation(
				draft.articleTicket.assignee.name,
				preferredLanguage,
			);
		const t = await getTranslations({ locale: preferredLanguage });
		const subject = publishingDate
			? t("articleScheduledEmail.subject")
			: t("articlePublished.subject");

		const { error } = await resend.emails.send({
			from: `${t("miscellaneous.churchName")} <${SENDER_EMAIL}>`,
			to: [`${recipientName} <${recipientEmail}>`],
			replyTo: MAILING_ADDRESS,
			subject: subject,
			react: publishingDate
				? ArticleScheduled({
						model: newReadonlyModel({
							language: preferredLanguage,
							title: t("articleScheduledEmail.title"),
							message: t("articleScheduledEmail.message", {
								name: recipientName,
								date: pickFullDateTranslation(
									new Date(publishingDate),
									preferredLanguage,
									true,
								),
								time: pickFullTimeTranslation(
									new Date(publishingDate),
									preferredLanguage,
									true,
									true,
								),
							}),
							articlePreview: {
								title: pickTranslation(
									title,
									preferredLanguage,
								),
								image: image.url,
								snippet: pickTranslation(
									snippet,
									preferredLanguage,
								),
								link: `${BASE_URL}/news/${link}`,
							},
						}),
					})
				: ArticlePublished({
						model: newReadonlyModel({
							language: preferredLanguage,
							title: t("articlePublished.title"),
							message: t("articlePublished.message", {
								name: recipientName,
							}),
							articlePreview: {
								title: pickTranslation(
									title,
									preferredLanguage,
								),
								image: image.url,
								snippet: pickTranslation(
									snippet,
									preferredLanguage,
								),
								link: `${BASE_URL}/news/${link}`,
							},
						}),
					}),
		});
		if (contact.error) console.error(contact.error);
		if (error) console.error(error);
	});
	return newArticle;
}

export async function updateExistingArticle({
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

	const {
		title,
		body,
		snippet,
		authorName,
		image,
		isArticleFeatured,
		publishingDate,
	} = await _validateNewArticle(incomingArticle, locale);
	const currentDate = new Date();
	if (
		publishingDate &&
		existingArticle.datePublished.getTime() <= currentDate.getTime()
	)
		throw new Error(
			"Article publishing date can no longer be rescheduled because the article has already been published.",
		);
	const placeholder = await getPlaceholder(image.url);

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
					upsert: {
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
							placeholder: {
								connectOrCreate: {
									create: {
										imageLink: image.url,
										placeholder,
									},
									where: {
										imageLink: image.url,
									},
								},
							},
						},
						update: {
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
							placeholder: {
								connectOrCreate: {
									create: {
										imageLink: image.url,
										placeholder,
									},
									where: {
										imageLink: image.url,
									},
								},
							},
						},
					},
				},
				dateUpdated:
					existingArticle.datePublished.getTime() <
						currentDate.getTime() &&
					hasArticleChanged(
						{
							title: existingArticle.title,
							author: {
								...existingArticle.author,
								name: existingArticle.author.name,
								profile: undefined,
							},
							body: existingArticle.body,
							articleImage: {
								url: existingArticle.image.link,
								caption: existingArticle.image.caption,
							},
						},
						incomingArticle,
					)
						? currentDate
						: undefined,
				datePublished:
					existingArticle.datePublished.getTime() >
					currentDate.getTime()
						? publishingDate
							? new Date(publishingDate)
							: undefined
						: undefined,
			},
			where: {
				link: articleId, // TODO: Change articleId to articleLink in future to avoid confusion
			},
		});
		if (isArticleFeatured) {
			await transaction.featuredArticle.upsert({
				create: { articleId: result.id },
				update: { dateFeatured: new Date() },
				where: { articleId: result.id },
			});
		}
		if (ticketId)
			await transaction.articleTicket.delete({ where: { id: ticketId } });
		return result;
	});
	revalidateTag("latest-articles", "max");
	revalidateTag(`article_${articleId}`, "max");
	if (publishingDate)
		after(async () => {
			const recipientEmail = existingArticle.author.email;
			const contact = await resend.contacts.get({
				email: recipientEmail,
			});
			const preferredLanguage =
				(contact.data?.properties.preferredLang.value as Language) ??
				"en";
			const recipientName =
				contact.data?.first_name ??
				pickTranslation(existingArticle.author.name, preferredLanguage);
			const t = await getTranslations({ locale: preferredLanguage });
			const { error } = await resend.emails.send({
				from: `${t("miscellaneous.churchName")} <${SENDER_EMAIL}>`,
				to: [`${recipientName} <${recipientEmail}>`],
				replyTo: MAILING_ADDRESS,
				subject: t("articleRescheduled.subject"),
				react: ArticleRescheduled({
					model: newReadonlyModel({
						language: preferredLanguage,
						title: t("articleRescheduled.title"),
						recipientName,
						articleTitle: pickTranslation(title, preferredLanguage),
						oldDate: existingArticle.datePublished,
						newDate: new Date(publishingDate),
					}),
				}),
			});
			if (error) console.error(error);
		});
	return newArticle;
}

export async function canUserEditArticle(articleUri: string) {
	const user = await getUserInformation();
	const articlePromise = getArticle(articleUri, "en");
	if (!user) return false;
	if (user.roles.some(role => role === "admin" || role === "editor"))
		return true;
	return user.email === (await articlePromise).author.email;
}

export async function addArticleAuthor(author: NewArticleAuthor) {
	await protect({ roles: ["editor"] });
	const { email, name, profile } = getArticleAuthorSchema().parse(author);

	const nameHash = getMd5Hash(name.english);
	const profilePicturePlaceholder =
		profile?.picture && (await getPlaceholder(profile.picture));

	const newAuthor = await database.articleAuthor.create({
		data: {
			email,
			name: {
				connectOrCreate: {
					create: { ...name, englishHash: nameHash },
					where: {
						englishHash: nameHash,
					},
				},
			},
			profile: profile && {
				create: {
					description: profile.description.english
						? {
								create: {
									...profile.description,
									english: profile.description.english,
									englishHash: getMd5Hash(
										profile.description.english,
									),
								},
							}
						: undefined,
					picture: profile.picture
						? {
								create: {
									link: profile.picture,
									placeholder: {
										connectOrCreate: {
											create: {
												imageLink: profile.picture,
												placeholder:
													profilePicturePlaceholder!,
											},
											where: {
												imageLink: profile.picture,
											},
										},
									},
								},
							}
						: undefined,
					contactEmail: profile.contactEmail ?? undefined,
				},
			},
		},
	});
	revalidateTag("article_authors", "max");
	return newAuthor;
}

export async function updateArticleAuthor(
	id: number,
	author: NewArticleAuthor,
) {
	await protect({ roles: ["editor"] });
	const { email, name, profile } = getArticleAuthorSchema().parse(author);

	const existingAuthor = await database.articleAuthor.findUnique({
		include: {
			name: true,
			profile: {
				include: {
					description: true,
					picture: { include: { placeholder: true } },
				},
			},
		},
		where: {
			id,
		},
	});

	if (!existingAuthor) notFound();

	const nameHash =
		existingAuthor.name.english !== name.english
			? getMd5Hash(name.english)
			: existingAuthor.name.englishHash;
	const profilePicturePlaceholder =
		profile?.picture &&
		((profile.picture !== existingAuthor.profile?.picture?.link
			? await getPlaceholder(profile.picture)
			: existingAuthor.profile.picture.placeholder.placeholder) ??
			(await getPlaceholder(profile.picture)));

	const record = await database.$transaction(async transaction => {
		return await transaction.articleAuthor.update({
			data: {
				email,
				name: {
					update: {
						...name,
						englishHash: nameHash,
					},
				},
				profile: {
					upsert: {
						create: {
							description: profile?.description.english
								? {
										connectOrCreate: {
											create: {
												...profile.description,
												english:
													profile.description.english,
												englishHash: getMd5Hash(
													profile.description.english,
												),
											},
											where: {
												englishHash: getMd5Hash(
													profile.description.english,
												),
											},
										},
									}
								: undefined,
							picture: profile?.picture
								? {
										connectOrCreate: {
											create: {
												link: profile.picture,
												placeholder: {
													connectOrCreate: {
														create: {
															imageLink:
																profile.picture,
															placeholder:
																profilePicturePlaceholder!,
														},
														where: {
															imageLink:
																profile.picture,
														},
													},
												},
											},
											where: {
												link: profile.picture,
											},
										},
									}
								: undefined,
							contactEmail: profile?.contactEmail,
						},
						update: {
							description: profile?.description.english
								? {
										upsert: {
											create: {
												...profile.description,
												english:
													profile.description.english,
												englishHash: getMd5Hash(
													profile.description.english,
												),
											},
											update: {
												...profile.description,
												english:
													profile.description.english,
												englishHash: getMd5Hash(
													profile.description.english,
												),
											},
										},
									}
								: existingAuthor.profile?.description === null
									? { delete: true }
									: undefined,
							picture: profile?.picture
								? {
										upsert: {
											create: {
												link: profile.picture,
												placeholder: {
													connectOrCreate: {
														create: {
															imageLink:
																profile.picture,
															placeholder:
																profilePicturePlaceholder!,
														},
														where: {
															imageLink:
																profile.picture,
														},
													},
												},
											},
											update: {
												link: profile.picture,
												placeholder: {
													update: {
														imageLink:
															profile.picture,
														placeholder:
															profilePicturePlaceholder!,
													},
												},
											},
										},
									}
								: profile?.picture === null &&
									  existingAuthor.profile?.picture
									? { delete: true }
									: undefined,
							contactEmail: profile?.contactEmail,
						},
						where: { articleAuthorId: id },
					},
				},
			},
			where: { id },
		});
	});
	return record;
	revalidateTag("article_authors", "max");
}

export async function deleteAuthorProfile(id: number) {
	await protect({ roles: ["editor"] });

	const author = await database.articleAuthor.findUnique({
		include: {
			profile: true,
		},
		where: {
			id,
		},
	});

	if (!author) notFound();

	if (author.profile)
		await database.articleAuthor.update({
			data: {
				profile: {
					delete: true,
				},
			},
			where: {
				id,
			},
		});
	revalidateTag("article_authors", "max");
}

export async function deleteAuthor(id: number) {
	await protect({ roles: ["editor"] });

	const author = await database.articleAuthor.findUnique({
		include: {
			profile: true,
		},
		where: {
			id,
		},
	});

	if (!author) notFound();

	await database.articleAuthor.delete({
		where: {
			id,
		},
	});
	revalidateTag("article_authors", "max");
}

async function _validateNewArticle(newArticle: NewArticle, locale?: Language) {
	const t = await getTranslations({ locale: locale ?? "en" });
	const articleSchema = getArticleSchema(t).transform(newArticle => ({
		...newArticle,
		snippet: {
			english:
				newArticle.snippet.english ??
				snippetify(removeMarkup(newArticle.body.english), MAX_SNIPPET),
			russian:
				newArticle.snippet.russian ??
				(newArticle.body.russian
					? snippetify(
							removeMarkup(newArticle.body.russian),
							MAX_SNIPPET,
						)
					: undefined),
		} satisfies Translation,
		link: z.string().slugify().parse(newArticle.title.english),
	}));

	return articleSchema.parse(newArticle) satisfies NewArticle & {
		link: string;
	};
}
