"use client";

import { ReviewArticleModel } from "@/src/lib/models/review-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import PageView from "../../page-view/PageView";
import { useTranslations } from "next-intl";
import { useArticlePreviewModal } from "@/src/lib/model-implementations/article-preview-modal";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useArticleSchema } from "@/src/lib/validation/article";
import Spinner from "../../spinner/Spinner";
import Editor from "../../editor/Editor";
import Button from "../../button/Button";
import ArticlePreviewModal from "../../article-preview-modal/ArticlePreviewModal";
import { useFileSelector } from "@/src/lib/model-implementations/file-selector";
import Image from "next/image";
import {
	BLANK_TRANSLATION,
	DEFAULT_ARTICLE_PREVIEW_IMAGE,
	DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER,
} from "@/src/lib/utilities/constants";
import { useImageProcessor } from "@/src/lib/model-implementations/image-processor";
import { useFileUploader } from "@/src/lib/model-implementations/file-uploader";
import { getPresignedUrl } from "@/src/lib/server-actions/file-transfer";
import { generateUniqueName } from "@/src/lib/utilities/miscellaneous";
import FileSelectorButton from "../../file-selector-button/FileSelectorButton";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import GoHomeButton from "../../button/GoHomeButton";
import SuccessGraphic from "@/public/assets/ornament_32.svg";
import { Check, X } from "lucide-react";
import InformationView from "../../information-view/InformationView";
import Checkbox from "../../checkbox/Checkbox";

const ReviewArticle = function ({ model }) {
	const { modelView, interact } = model;
	const { draftAssigneeName, draft, currentArticle, notification } =
		modelView;
	const t = useTranslations("reviewArticle");
	const tMisc = useTranslations("miscellaneous");
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(useArticleSchema()),
		defaultValues: {
			title: draft.title,
			body: draft.body,
			authorName: draftAssigneeName,
			snippet: currentArticle?.snippet ?? BLANK_TRANSLATION,
			image: {
				url: currentArticle?.articleImage.url,
				caption:
					currentArticle?.articleImage.caption ?? BLANK_TRANSLATION,
			},
			isArticleFeatured: false,
		},
		shouldUnregister: true,
	});
	const articlePreviewModal = useArticlePreviewModal(
		handleSubmit(async form => {
			await articlePreviewModal.interact({ type: "CLOSE" });
			await interact({
				type: "PUBLISH",
				input: {
					article: form,
				},
			});
		}),
	);
	const imageProcessor = useImageProcessor();
	const fileUploader = useFileUploader();
	const imageSelector = useFileSelector({
		type: "image",
		async selectCallback(file) {
			if (
				!(
					notification?.type === "submitting" ||
					notification?.type === "submit_success"
				)
			)
				await imageProcessor.interact({
					type: "PROCESS",
					input: {
						file,
						async successCallback(processedImage) {
							const presignedUrl = await getPresignedUrl(
								generateUniqueName(),
								"news",
								processedImage.type,
							);
							await fileUploader.interact({
								type: "UPLOAD",
								input: {
									file: processedImage,
									presignedUrl,
									successCallback(imageUrl) {
										setValue("image.url", imageUrl);
									},
								},
							});
						},
					},
				});
		},
	});
	// TODO: Combine both into their own component I think
	const imageStatus =
		imageProcessor.modelView.notification === null &&
		fileUploader.modelView.notification === null
			? null
			: imageProcessor.modelView.notification?.type === "processing" ||
				  fileUploader.modelView.notification?.type === "uploading"
				? "processing"
				: imageProcessor.modelView.notification?.type ===
							"processing_failed" ||
					  fileUploader.modelView.notification?.type ===
							"upload_fail"
					? "error"
					: "success";
	const imageStatusMessage =
		imageProcessor.modelView.notification?.type === "processing" ||
		imageProcessor.modelView.notification?.type === "processing_failed"
			? imageProcessor.modelView.notification.message
			: (fileUploader.modelView.notification?.message ?? null);

	useCloseWarning(() => !(notification?.type === "submit_success"));

	if (notification?.type === "submit_success")
		return (
			<InformationView
				model={newReadonlyModel({
					mainMessage: t("mainMessage"),
					detailedMessage: t("detailedMessage"),
					Graphic: SuccessGraphic,
				})}
			>
				<GoHomeButton>{t("nextButton")}</GoHomeButton>
			</InformationView>
		);
	register("image.url");

	return (
		<>
			<ArticlePreviewModal model={articlePreviewModal} />
			<PageView model={newReadonlyModel({ title: t("title") })}>
				<form
					onSubmit={handleSubmit(form =>
						articlePreviewModal.interact({
							type: "OPEN",
							input: {
								title: form.title,
								body: form.body,
								authorName: form.authorName,
								dateCreated:
									currentArticle?.dateCreated ?? new Date(),
								snippet: form.snippet,
								image: form.image,
							},
						}),
					)}
				>
					<div className="flex flex-col gap-3">
						<input
							{...register("title.english")}
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
						<input
							{...register("authorName.english")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.authorName?.english ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("authorNameField")}
							autoComplete="name"
							autoCapitalize="words"
							disabled={!currentArticle}
						/>
						{errors.authorName?.english && (
							<span className="text-sm text-red-800">
								{errors.authorName.english.message}
							</span>
						)}
						<Controller
							control={control}
							name={"body.english"}
							render={({ field: { onChange } }) => (
								<Editor
									model={newReadonlyModel({
										initialContent: draft.body.english,
										className: errors.body?.english
											? "border-red-800"
											: "border-gray-400",
										changeCallback: onChange,
									})}
								/>
							)}
						/>
						{errors.body?.english && (
							<span className="text-sm text-red-800">
								{errors.body.message}
							</span>
						)}
						<div className="flex h-[15em] w-full items-stretch justify-stretch overflow-clip rounded-lg md:h-fit md:max-h-[25em] md:max-w-[33em]">
							<Image
								className="h-full w-full grow object-cover object-center"
								src={
									imageProcessor.modelView
										.processedImageBlobUrl ??
									currentArticle?.articleImage.url ??
									DEFAULT_ARTICLE_PREVIEW_IMAGE
								}
								placeholder="blur"
								blurDataURL={
									currentArticle?.articleImage.placeholder ??
									DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER
								}
								alt={t("imageAlt")}
								unoptimized={true}
							/>
						</div>
						{errors.image?.url && (
							<span className="text-sm text-red-800">
								{errors.image.url.message}
							</span>
						)}
						<div className="flex items-center gap-6">
							<FileSelectorButton
								model={newReadonlyModel({
									fileSelector: imageSelector,
									contents: currentArticle?.articleImage
										? t("changeImage")
										: t("selectImage"),
									contentsWhenFile: t("changeImage"),
								})}
							/>
							{imageStatus && (
								<div className="flex items-center gap-3">
									{imageStatus === "processing" && (
										<Spinner
											model={newReadonlyModel({
												size: 20,
												color: "black",
											})}
										/>
									)}
									{imageStatus === "success" && (
										<Check className="size-8 stroke-black" />
									)}
									{imageStatus === "error" && (
										<X className="size-8 stroke-red-800 text-red-800" />
									)}
									{imageStatusMessage && (
										<span
											className={`text-sm ${imageStatus === "error" ? "text-red-800" : "text-black"}`}
										>
											{imageStatusMessage}
										</span>
									)}
								</div>
							)}
						</div>
						<input
							{...register("image.caption.english")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.image?.caption?.english ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("imageCaptionField")}
							autoComplete="off"
						/>
						{errors.image?.caption?.english && (
							<span className="text-sm text-red-800">
								{errors.image.caption?.english.message}
							</span>
						)}
						<input
							{...register("snippet.english")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.snippet?.english ? "border-red-800" : "border-gray-400"}`}
							placeholder={`${t("snippetField")} (${tMisc("optional")})`}
							autoComplete="off"
						/>
						{errors.snippet?.english && (
							<span className="text-sm text-red-800">
								{errors.snippet?.english?.message}
							</span>
						)}
						{!currentArticle?.isArticleFeatured && (
							<Controller
								control={control}
								name={"isArticleFeatured"}
								render={({ field: { onChange, value } }) => (
									<Checkbox
										model={newReadonlyModel({
											isChecked: value,
											label: t("featureTheArticle"),
											checkedChangeCallback: onChange,
										})}
									/>
								)}
							/>
						)}
						{errors.form && (
							<span className="text-sm text-red-800">
								{errors.form.message}
							</span>
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
									className:
										"w-fit flex items-center justify-center max-w-1/2 min-w-[8em]",
								})}
							>
								{notification?.type === "submitting" ? (
									<Spinner
										model={newReadonlyModel({
											color: "white",
											size: 20,
										})}
									/>
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
