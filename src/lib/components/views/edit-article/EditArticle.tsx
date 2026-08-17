"use client";

import ArticlePreviewModal from "@/src/lib/components/article-preview-modal/ArticlePreviewModal";
import Button from "@/src/lib/components/button/Button";
import Editor from "@/src/lib/components/editor/Editor";
import Spinner from "@/src/lib/components/spinner/Spinner";
import { useArticlePreviewModal } from "@/src/lib/model-implementations/article-preview-modal";
import { useEditor } from "@/src/lib/model-implementations/editor";
import { EditArticleModel } from "@/src/lib/models/edit-article";
import { georgia } from "@/src/lib/third-party/fonts";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import { useEditArticleFormSchema } from "@/src/lib/validation/edit-article-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import GoHomeButton from "../../button/GoHomeButton";
import SuccessGraphic from "@/public/assets/icon-2.svg";

const EditArticle = function ({ model }) {
	const { modelView, interact } = model;
	const { notification, lastSavedDraft, author, currentArticle } = modelView;
	const t = useTranslations("editArticle");
	const defaultTitle = "";
	const defaultBody = `<p>${t("bodyPlaceholder")}</p>`;
	const articleFormSchema = useEditArticleFormSchema();
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting, errors },
		setValue,
		watch,
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(articleFormSchema),
		shouldUnregister: true,
		defaultValues: {
			title: lastSavedDraft?.title ?? defaultTitle,
			body: lastSavedDraft?.body ?? defaultBody,
		},
	});
	const editor = useEditor(lastSavedDraft?.body ?? defaultBody, {
		updateCallback: async content => setValue("body", content),
	});
	const title = watch("title");
	const body = watch("body");
	const previewAuthor =
		currentArticle?.author.name ?? author ?? t("unknownAuthor");
	const hasDraftChanged = lastSavedDraft
		? !(title === lastSavedDraft.title && body === lastSavedDraft.body)
		: !(title === defaultTitle && body === defaultBody);
	const articlePreviewModal = useArticlePreviewModal(
		handleSubmit(async form => {
			await articlePreviewModal.interact({ type: "CLOSE" });
			await interact({
				type: "SUBMIT",
				input: {
					draft: {
						title: form.title,
						body: form.body,
					},
					options: {
						async successCallback() {
							await editor.interact({
								type: "UPDATE_EDITOR",
								input: {
									content: defaultBody,
								},
							});
							reset({
								title: defaultTitle,
								body: defaultBody,
							});
						},
					},
				},
			});
		}),
	);
	register("body");
	useCloseWarning(
		useCallback(
			() => !(notification?.type === "submit_success") && hasDraftChanged,
			[notification?.type, hasDraftChanged],
		),
	);
	useEffect(() => {
		if (notification?.type === "submit_success") {
			window.scrollTo(0, 0);
		}
	}, [notification?.type]);

	return (
		<>
			<ArticlePreviewModal model={articlePreviewModal} />
			<main className="edit-article border-t-15 border-t-[#976029] bg-[#FEF8F3] text-black">
				{notification?.type !== "submit_success" ? (
					<div className="edit-article-content flex flex-col gap-6 p-8 py-9 md:py-10 lg:px-20">
						<span
							className={`mb-2 text-[2.75rem]/tight font-semibold md:text-black ${georgia.className}`}
						>
							{t("title")}
							<hr className="mt-4 mb-0 md:w-full" />
						</span>
						<form
							onSubmit={handleSubmit(
								async form =>
									await articlePreviewModal.interact({
										type: "OPEN",
										input: {
											title: form.title,
											body: form.body,
											authorName: previewAuthor,
											dateCreated:
												currentArticle?.dateCreated,
											snippet: currentArticle?.snippet,
											image: currentArticle?.articleImage,
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
								{errors.form && (
									<span className="text-sm text-red-800">
										{errors.form.message}
									</span>
								)}
								<hr className="mt-6 w-full opacity-50" />
								<div className="mt-1 flex w-full justify-start gap-3">
									<Button
										model={newReadonlyModel({
											type: "button",
											disabled:
												!hasDraftChanged ||
												notification?.type ===
													"saving_draft" ||
												notification?.type ===
													"submitting",
											className:
												"flex justify-center items-center w-fit max-w-1/2 min-w-[8em]",
											action: async () =>
												await interact({
													type: "SAVE_DRAFT",
													input: {
														draft: {
															title,
															body,
														},
													},
												}),
										})}
									>
										{notification?.type ===
										"saving_draft" ? (
											<Spinner
												model={newReadonlyModel({
													color: "white",
													size: 20,
												})}
											/>
										) : (
											t("saveDraft")
										)}
									</Button>
									<Button
										model={newReadonlyModel({
											type: "submit",
											variant: "standard",
											disabled:
												isSubmitting ||
												notification?.type ===
													"submitting",
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
											t("submit")
										)}
									</Button>
								</div>
							</div>
						</form>
					</div>
				) : (
					<div className="flex h-full min-h-[94svh] grow justify-center p-8 py-15 pb-20 text-center">
						<div className="flex h-[70svh] min-h-fit w-md flex-col items-center justify-center gap-6">
							<SuccessGraphic className="h-64 w-80 fill-black opacity-90 md:h-48" />
							<span
								className={`text-4xl font-semibold ${georgia.className}`}
							>
								{t("mainMessage")}
							</span>
							<span className="text-lg">
								{t("detailedMessage")}
							</span>
							<GoHomeButton>{t("nextButton")}</GoHomeButton>
						</div>
					</div>
				)}
			</main>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<EditArticleModel>>;

export default EditArticle;
