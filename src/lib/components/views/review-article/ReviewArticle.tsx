"use client";

import SuccessGraphic from "@/public/assets/ornament_32.svg";
import { useCloseWarning } from "@/src/lib/client-only/miscellaneous";
import { useArticlePreviewModal } from "@/src/lib/model-implementations/article-preview-modal";
import { useFileSelector } from "@/src/lib/model-implementations/file-selector";
import { useFileUploader } from "@/src/lib/model-implementations/file-uploader";
import { useImageProcessor } from "@/src/lib/model-implementations/image-processor";
import { ReviewArticleModel } from "@/src/lib/models/review-article";
import { getPresignedUrl } from "@/src/lib/server-actions/file-transfer";
import {
	BLANK_TRANSLATION,
	DEFAULT_ARTICLE_PREVIEW_IMAGE,
	DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER,
} from "@/src/lib/utilities/constants";
import {
	getDateLocale,
	getDateTimeString,
	NATIVE_TIMEZONE,
	pickTimeTranslation,
} from "@/src/lib/utilities/date-time";
import { generateUniqueName } from "@/src/lib/utilities/miscellaneous";
import { useArticleSchema } from "@/src/lib/validation/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { toZonedTime } from "date-fns-tz";
import { Check, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import ArticlePreviewModal from "../../article-preview-modal/ArticlePreviewModal";
import Button from "../../button/Button";
import GoHomeButton from "../../button/GoHomeButton";
import Checkbox from "../../checkbox/Checkbox";
import Editor from "../../editor/Editor";
import FileSelectorButton from "../../file-selector-button/FileSelectorButton";
import InformationView from "../../information-view/InformationView";
import PageView from "../../page-view/PageView";
import Spinner from "../../spinner/Spinner";
import { useImageUploader } from "@/src/lib/model-implementations/image-uploader";
import { useArticleAuthor } from "@/src/lib/model-implementations/article-author";
import { useArticleAuthorModal } from "@/src/lib/model-implementations/article-author-modal";
import ArticleAuthorModal from "../../article-author-modal/ArticleAuthorModal";

const ReviewArticle = function ({ model }) {
	const { modelView, interact } = model;
	const {
		articleAuthor: initialArticleAuthor,
		draft,
		currentArticle,
		notification,
	} = modelView;
	const t = useTranslations("reviewArticle");
	const tMisc = useTranslations("miscellaneous");
	const locale = useLocale();
	const currentDate = new Date();
	const hasBeenPublished = currentArticle
		? currentDate.getTime() >=
			toZonedTime(currentArticle.datePublished, NATIVE_TIMEZONE).getTime()
		: false;
	const {
		control,
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting, isDirty },
	} = useForm({
		resolver: zodResolver(
			useArticleSchema().extend({
				isPublishingScheduled: z.boolean(),
			}),
		),
		defaultValues: {
			title: draft.title,
			body: draft.body,
			snippet: currentArticle?.snippet ?? BLANK_TRANSLATION,
			image: {
				url: currentArticle?.articleImage.url,
				caption:
					currentArticle?.articleImage.caption ?? BLANK_TRANSLATION,
			},
			isArticleFeatured: currentArticle?.isArticleFeatured ?? false,
			isPublishingScheduled:
				!hasBeenPublished && Boolean(currentArticle?.datePublished),
			publishingDate: currentArticle
				? getDateTimeString(currentArticle.datePublished, true)
				: getDateTimeString(currentDate),
		},
		shouldUnregister: true,
	});
	const articleAuthor = useArticleAuthor({
		initialModelView: { author: initialArticleAuthor },
		notifier: "default",
	});
	const articleAuthorModal = useArticleAuthorModal({
		addAuthorCallback: async (author, id, successCallback) =>
			await articleAuthor.interact({
				type: "ADD_AUTHOR",
				input: { author, id, successCallback },
			}),
		deleteProfileCallback: async (id, successCallback) =>
			await articleAuthor.interact({
				type: "DELETE_PROFILE",
				input: { id, successCallback },
			}),
	});
	const articlePreviewModal = useArticlePreviewModal(
		handleSubmit(async form => {
			await articlePreviewModal.interact({ type: "CLOSE" });
			await interact({
				type: "PUBLISH",
				input: {
					article: {
						...form,
						publishingDate: form.publishingDate
							? new Date(form.publishingDate).toISOString()
							: undefined,
					},
				},
			});
		}),
	);
	const imageUploader = useImageUploader();
	const imageSelector = useFileSelector({
		type: "image",
		async selectCallback(file) {
			if (
				!(
					notification?.type === "submitting" ||
					notification?.type === "submit_success"
				)
			)
				await imageUploader.interact({
					type: "UPLOAD",
					input: {
						file,
						successCallback(imageUrl) {
							setValue("image.url", imageUrl);
						},
					},
				});
		},
	});
	const imageUploaderNotification = imageUploader.modelView.notification;

	useCloseWarning(
		() => !(notification?.type === "submit_success") && isDirty,
	);

	if (notification?.type === "submit_success")
		return (
			<InformationView
				model={newReadonlyModel(
					notification.publishingDate
						? {
								mainMessage: t("scheduledPublishMainMessage"),
								Graphic: SuccessGraphic,
							}
						: {
								mainMessage: t("mainMessage"),
								detailedMessage: t("detailedMessage"),
								Graphic: SuccessGraphic,
							},
				)}
			>
				<span className="text-lg">
					{notification.publishingDate &&
						t.rich("scheduledPublishDetailedMessage", {
							date: notification.publishingDate.toLocaleDateString(
								getDateLocale(locale),
								{ dateStyle: "full" },
							),
							time: pickTimeTranslation(
								notification.publishingDate,
								locale,
							),
							mkp: innerHtml => (
								<span className="font-semibold">
									{innerHtml}
								</span>
							),
						})}
				</span>
				<GoHomeButton>{t("nextButton")}</GoHomeButton>
			</InformationView>
		);

	return (
		<>
			<ArticleAuthorModal model={articleAuthorModal} />
			<ArticlePreviewModal model={articlePreviewModal} />
			<PageView model={newReadonlyModel({ title: t("title") })}>
				<form
					onSubmit={handleSubmit(form =>
						articlePreviewModal.interact({
							type: "OPEN",
							input: {
								title: form.title,
								body: form.body,
								authorName:
									articleAuthor.modelView.author!.name,
								datePublished: form.publishingDate
									? new Date(form.publishingDate)
									: (currentArticle?.datePublished ??
										new Date()),
								snippet: form.snippet ?? undefined,
								image: form.image,
							},
						}),
					)}
				>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-6 gap-x-12 lg:flex-row">
							<div className="flex flex-1 flex-col gap-3">
								<input
									{...register("title.english")}
									lang="en"
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.title?.english ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("titleField")}
									autoComplete="off"
									autoCapitalize="words"
								/>
								{errors.title?.english && (
									<span className="text-sm text-red-800">
										{errors.title.english.message}
									</span>
								)}
								<Controller
									control={control}
									name={"body.english"}
									render={({
										field: { onChange, value },
										fieldState: { error },
									}) => (
										<>
											<Editor
												model={newReadonlyModel({
													initialContent: value,
													className: error
														? "border-red-800"
														: "border-gray-400",
													changeCallback: onChange,
													locale: "en",
												})}
											/>
											{error && (
												<span className="text-sm text-red-800">
													{error.message}
												</span>
											)}
										</>
									)}
								/>
								<input
									{...register("snippet.english")}
									lang="en"
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.snippet?.english ? "border-red-800" : "border-gray-400"}`}
									placeholder={`${t("snippetField")} (${tMisc("optional")})`}
									autoComplete="off"
								/>
								{errors.snippet?.english && (
									<span className="text-sm text-red-800">
										{errors.snippet?.english?.message}
									</span>
								)}

								<Button
									model={newReadonlyModel({
										action() {
											articleAuthorModal.interact({
												type: "OPEN",
												input: {
													author: articleAuthor
														.modelView.author,
												},
											});
										},
									})}
									className="w-full"
								>
									{t("modifyAuthor")}
								</Button>
							</div>
							<div className="flex flex-1 flex-col gap-3 md:max-w-[33em]">
								<Controller
									control={control}
									name="image.url"
									render={({
										field: { value, ref },
										fieldState: { error },
									}) => (
										<>
											<div
												className="flex h-[15em] w-full items-stretch justify-stretch overflow-clip rounded-lg md:h-fit md:max-h-[25em]"
												ref={ref}
												tabIndex={0}
											>
												<Image
													className="h-full w-full grow object-cover object-center"
													src={
														imageUploader.modelView
															.processedImage
															?.blobURL ??
														(value
															? value
															: DEFAULT_ARTICLE_PREVIEW_IMAGE)
													}
													placeholder="blur"
													blurDataURL={
														currentArticle
															?.articleImage
															.placeholder ??
														DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER
													}
													alt={t("imageAlt")}
													unoptimized={true}
												/>
											</div>
											{error && (
												<span className="text-sm text-red-800">
													{error.message}
												</span>
											)}
											<div className="flex items-center gap-6">
												<FileSelectorButton
													model={newReadonlyModel({
														fileSelector:
															imageSelector,
														contents:
															currentArticle?.articleImage
																? t(
																		"changeImage",
																	)
																: t(
																		"selectImage",
																	),
														contentsWhenFile:
															t("changeImage"),
													})}
												/>
												{imageUploaderNotification && (
													<div className="flex items-center gap-3">
														{imageUploaderNotification.type ===
															"processing" && (
															<Spinner
																model={newReadonlyModel(
																	{
																		size: 20,
																		color: "black",
																	},
																)}
															/>
														)}
														{imageUploaderNotification.type ===
															"success" && (
															<Check className="size-8 stroke-black" />
														)}
														{imageUploaderNotification.type ===
															"error" && (
															<X className="size-8 stroke-red-800 text-red-800" />
														)}
														{imageUploaderNotification.message && (
															<span
																className={`text-sm ${imageUploaderNotification.type === "error" ? "text-red-800" : "text-black"}`}
															>
																{
																	imageUploaderNotification.message
																}
															</span>
														)}
													</div>
												)}
											</div>
										</>
									)}
								/>
								<input
									{...register("image.caption.english")}
									lang="en"
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.image?.caption?.english ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("imageCaptionField")}
									autoComplete="off"
								/>
								{errors.image?.caption?.english && (
									<span className="text-sm text-red-800">
										{errors.image.caption?.english.message}
									</span>
								)}
							</div>
						</div>
						<Controller
							control={control}
							name={"isArticleFeatured"}
							render={({ field: { onChange, value } }) => (
								<Checkbox
									model={newReadonlyModel({
										isChecked: value,
										disabled:
											currentArticle?.isArticleFeatured,
										label: t("featureTheArticle"),
										checkedChangeCallback: onChange,
									})}
								/>
							)}
						/>
						{errors.form && (
							<span className="text-sm text-red-800">
								{errors.form.message}
							</span>
						)}
						<Controller
							control={control}
							name={"isPublishingScheduled"}
							render={({ field: { onChange, value } }) => (
								<Checkbox
									model={newReadonlyModel({
										isChecked: value && !hasBeenPublished,
										disabled: hasBeenPublished,
										label: t("schedulePublish"),
										checkedChangeCallback: onChange,
									})}
								/>
							)}
						/>
						{!hasBeenPublished &&
							watch("isPublishingScheduled") && (
								<>
									<input
										{...register("publishingDate")}
										type="datetime-local"
										className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.publishingDate ? "border-red-800" : "border-gray-400"}`}
										placeholder={t("publishingDateField")}
										min={getDateTimeString(currentDate)}
									/>
									{errors.publishingDate && (
										<span className="text-sm text-red-800">
											{errors.publishingDate.message}
										</span>
									)}
								</>
							)}
						<hr className="mt-6 w-full opacity-50" />
						<div className="mt-1 flex w-full justify-start gap-3">
							<Button
								model={newReadonlyModel({
									type: "submit",
									variant: "standard",
									disabled:
										isSubmitting ||
										notification?.type === "submitting",
								})}
								className="flex w-fit max-w-1/2 min-w-[8em] items-center justify-center"
							>
								{notification?.type === "submitting" ? (
									<Spinner
										model={newReadonlyModel({
											color: "white",
											size: 20,
										})}
									/>
								) : watch("isPublishingScheduled") ? (
									t("submit")
								) : (
									t("publish")
								)}
							</Button>
						</div>
					</div>
				</form>
			</PageView>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<ReviewArticleModel>>;

export default ReviewArticle;
