"use client";

import ArticlePreviewModal from "@/src/lib/components/article-preview-modal/ArticlePreviewModal";
import Button from "@/src/lib/components/button/Button";
import Editor from "@/src/lib/components/editor/Editor";
import Spinner from "@/src/lib/components/spinner/Spinner";
import { useArticlePreviewModal } from "@/src/lib/model-implementations/article-preview-modal";
import { useEditor } from "@/src/lib/model-implementations/editor";
import { WriteArticleModel } from "@/src/lib/models/write-article";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import { useWriteArticleFormSchema } from "@/src/lib/validation/write-article-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import ButtonBar from "../../button-bar/ButtonBar";
import PageView from "../../page-view/PageView";
import { useConfirmationDialog } from "@/src/lib/model-implementations/confirmation-dialog";
import ConfirmationDialog from "../../confirmation-dialog/ConfirmationDialog";
import SubmitGraphic from "@/public/assets/icon-2.svg";
import DiscardGraphic from "@/public/assets/graphic-1.svg";
import GoHomeButton from "../../button/GoHomeButton";
import InformationView from "../../information-view/InformationView";

const WriteArticle = function ({ model }) {
	const { modelView, interact } = model;
	const { notification, lastSavedDraft, author, currentArticle } = modelView;
	const t = useTranslations("writeArticle");
	const tMisc = useTranslations("miscellaneous");
	const defaultTitle = "";
	const defaultBody = `<p>${t("bodyPlaceholder")}</p>`;
	const articleFormSchema = useWriteArticleFormSchema();
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
	const confirmationDialog = useConfirmationDialog();
	register("body");
	useCloseWarning(
		useCallback(
			() => !(notification?.type === "submit_success") && hasDraftChanged,
			[notification?.type, hasDraftChanged],
		),
	);

	if (notification?.type === "submit_success")
		return (
			<InformationView
				model={newReadonlyModel({
					mainMessage: t("mainMessage"),
					detailedMessage: t("detailedMessage"),
					Graphic: SubmitGraphic,
				})}
			>
				<GoHomeButton>{tMisc("continue")}</GoHomeButton>
			</InformationView>
		);
	if (notification?.type === "discard_draft_success")
		return (
			<InformationView
				model={newReadonlyModel({
					mainMessage: t("discardDraftMainMessage"),
					detailedMessage: t("discardDraftSuccess"),
					Graphic: DiscardGraphic,
				})}
			>
				<GoHomeButton>{tMisc("continue")}</GoHomeButton>
			</InformationView>
		);
	return (
		<>
			<ArticlePreviewModal model={articlePreviewModal} />
			<ConfirmationDialog model={confirmationDialog} />
			<PageView
				model={newReadonlyModel({
					title: t("title"),
					topBarColor: "#976029",
				})}
			>
				<form
					onSubmit={handleSubmit(
						async form =>
							await articlePreviewModal.interact({
								type: "OPEN",
								input: {
									title: form.title,
									body: form.body,
									authorName: previewAuthor,
									dateCreated: currentArticle?.dateCreated,
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
						<ButtonBar
							model={newReadonlyModel({
								className: "mt-1",
								orientation: "horizontal",
								arrangement: "left",
							})}
						>
							<Button
								model={newReadonlyModel({
									title: t("discardDraftButton"),
									variant: "alternative",
									disabled:
										notification?.type ===
											"discarding_draft" ||
										notification?.type === "saving_draft" ||
										notification?.type === "submitting",
									className:
										"flex justify-center items-center w-fit",
									async action() {
										await confirmationDialog.interact({
											type: "OPEN",
											input: {
												message: t(
													"discardDraftDialogMessage",
												),
												proceedCallback: async () =>
													await interact({
														type: "DISCARD_DRAFT",
													}),
											},
										});
									},
								})}
							>
								{notification?.type === "discarding_draft" ? (
									<Spinner
										model={newReadonlyModel({
											color: "#250203",
											size: 20,
										})}
									/>
								) : (
									<Trash2Icon strokeWidth={1.5} />
								)}
							</Button>
							<Button
								model={newReadonlyModel({
									disabled:
										!hasDraftChanged ||
										notification?.type === "saving_draft" ||
										notification?.type ===
											"discarding_draft" ||
										notification?.type === "submitting",
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
								{notification?.type === "saving_draft" ? (
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
										notification?.type === "submitting" ||
										notification?.type ===
											"discarding_draft",
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
						</ButtonBar>
					</div>
				</form>
			</PageView>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<WriteArticleModel>>;

export default WriteArticle;
