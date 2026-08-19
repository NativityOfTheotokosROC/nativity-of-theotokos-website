"use client";

import { ReviewArticleModel } from "@/src/lib/models/review-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import PageView from "../../page-view/PageView";
import { useTranslations } from "next-intl";
import { useArticlePreviewModal } from "@/src/lib/model-implementations/article-preview-modal";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePublishArticleFormSchema } from "@/src/lib/validation/publish-article-form";
import Spinner from "../../spinner/Spinner";
import Editor from "../../editor/Editor";
import Button from "../../button/Button";
import { useEditor } from "@/src/lib/model-implementations/editor";
import ArticlePreviewModal from "../../article-preview-modal/ArticlePreviewModal";
import { useFileSelectorButton } from "@/src/lib/model-implementations/file-selector-button";
import Image from "next/image";
import {
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
	const publishArticleFormSchema = usePublishArticleFormSchema();
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(publishArticleFormSchema),
		defaultValues: {
			title: draft.title,
			body: draft.body,
			authorName: draftAssigneeName,
			snippet: currentArticle?.snippet ?? "",
			imageUrl: currentArticle?.articleImage.source ?? "",
			imageCaption: currentArticle?.articleImage.about ?? "",
			isArticleFeatured: false,
		},
	});
	const articlePreviewModal = useArticlePreviewModal(
		handleSubmit(async form => {
			await articlePreviewModal.interact({ type: "CLOSE" });
			const {
				title,
				body,
				authorName,
				imageUrl,
				imageCaption,
				snippet,
				isArticleFeatured,
			} = form;
			await interact({
				type: "PUBLISH",
				input: {
					draft: { title, body },
					imageUrl,
					imageCaption,
					authorName: authorName ?? draftAssigneeName,
					snippet,
					isArticleFeatured,
				},
			});
		}),
	);
	const editor = useEditor(draft.body, {
		async updateCallback(content) {
			setValue("body", content);
		},
	});
	const imageProcessor = useImageProcessor();
	const fileUploader = useFileUploader();
	const imageSelector = useFileSelectorButton({
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
									async successCallback(imageUrl) {
										setValue("imageUrl", imageUrl);
									},
								},
							});
						},
					},
				});
		},
	});
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

	register("imageUrl");
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

	return (
		<>
			<ArticlePreviewModal model={articlePreviewModal} />
			<PageView model={newReadonlyModel({ title: t("title") })}>
				<form
					onSubmit={handleSubmit(
						async form =>
							await articlePreviewModal.interact({
								type: "OPEN",
								input: {
									title: form.title,
									body: form.body,
									authorName:
										form.authorName ?? draftAssigneeName,
									dateCreated:
										currentArticle?.dateCreated ??
										new Date(),
									snippet: form.snippet,
									image: {
										source: form.imageUrl,
										about: form.imageCaption,
										placeholder:
											currentArticle?.articleImage
												.placeholder,
									},
								},
							}),
					)}
				>
					<div className="flex flex-col gap-3">
						<input
							{...register("title")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.title ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("titleField")}
							autoComplete="off"
							autoCapitalize="words"
						/>
						{errors.title && (
							<span className="text-sm text-red-800">
								{errors.title.message}
							</span>
						)}
						<input
							{...register("authorName")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.authorName ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("authorNameField")}
							autoComplete="name"
							autoCapitalize="words"
							disabled={!currentArticle}
						/>
						{errors.authorName && (
							<span className="text-sm text-red-800">
								{errors.authorName.message}
							</span>
						)}
						<Editor
							model={{
								...editor,
								modelView: {
									...editor.modelView,
									className: errors.body
										? "border-red-800"
										: "border-gray-400",
								},
							}}
						/>
						{errors.body && (
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
									currentArticle?.articleImage.source ??
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
						{errors.imageUrl && (
							<span className="text-sm text-red-800">
								{errors.imageUrl.message}
							</span>
						)}
						<div className="flex items-center gap-6">
							<FileSelectorButton model={imageSelector}>
								{imageSelector.modelView.file ||
								currentArticle?.articleImage
									? t("changeImage")
									: t("selectImage")}
							</FileSelectorButton>
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
							{...register("imageCaption")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.imageCaption ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("imageCaptionField")}
							autoComplete="off"
						/>
						{errors.imageCaption && (
							<span className="text-sm text-red-800">
								{errors.imageCaption.message}
							</span>
						)}
						<input
							{...register("snippet")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.snippet ? "border-red-800" : "border-gray-400"}`}
							placeholder={`${t("snippetField")} (${tMisc("optional")})`}
							autoComplete="off"
						/>
						{errors.snippet && (
							<span className="text-sm text-red-800">
								{errors.snippet.message}
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
