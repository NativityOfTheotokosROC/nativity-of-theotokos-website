"use client";

import DiscardGraphic from "@/public/assets/graphic-1.svg";
import SubmitGraphic from "@/public/assets/icon-2.svg";
import ArticlePreviewModal from "@/src/lib/components/article-preview-modal/ArticlePreviewModal";
import Button from "@/src/lib/components/button/Button";
import Editor from "@/src/lib/components/editor/Editor";
import Spinner from "@/src/lib/components/spinner/Spinner";
import { useArticlePreviewModal } from "@/src/lib/model-implementations/article-preview-modal";
import { useConfirmationDialog } from "@/src/lib/model-implementations/confirmation-dialog";
import { WriteArticleModel } from "@/src/lib/models/write-article";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import { CompleteTranslation } from "@/src/lib/utilities/types";
import { useArticleSubmissionSchema } from "@/src/lib/validation/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import ButtonBar from "../../button-bar/ButtonBar";
import GoHomeButton from "../../button/GoHomeButton";
import ConfirmationDialog from "../../confirmation-dialog/ConfirmationDialog";
import InformationView from "../../information-view/InformationView";
import PageView from "../../page-view/PageView";
import { BLANK_TRANSLATION } from "@/src/lib/utilities/constants";

const WriteArticle = function ({ model }) {
	const { modelView, interact } = model;
	const {
		notification,
		lastSavedDraft,
		authorName: author,
		currentArticle,
	} = modelView;
	const t = useTranslations("writeArticle");
	const tMisc = useTranslations("miscellaneous");
	const defaultTitle = BLANK_TRANSLATION;
	const defaultBody = {
		english: `<p>${t("bodyPlaceholder")}</p>`,
		russian: `<p>${t("bodyPlaceholder")}</p>`,
	} satisfies CompleteTranslation;
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting, errors },
		getValues,
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(useArticleSubmissionSchema()),
		shouldUnregister: true,
		defaultValues: {
			title: lastSavedDraft?.title ?? defaultTitle,
			body: lastSavedDraft?.body ?? defaultBody,
		},
	});
	const previewAuthor = currentArticle?.author.name ??
		author ?? { english: t("unknownAuthor"), russian: t("unknownAuthor") };
	const hasDraftChanged = lastSavedDraft
		? !(
				getValues("title.english") === lastSavedDraft.title.english &&
				getValues("body.english") === lastSavedDraft.body.english &&
				getValues("title.russian") === lastSavedDraft.title.russian &&
				getValues("body.russian") === lastSavedDraft.body.russian
			)
		: !(
				getValues("title.english") === defaultTitle.english &&
				getValues("body.english") === defaultBody.english &&
				getValues("title.russian") === defaultTitle.russian &&
				getValues("body.russian") === defaultBody.russian
			);
	const articlePreviewModal = useArticlePreviewModal(
		handleSubmit(async form => {
			articlePreviewModal.interact({ type: "CLOSE" });
			await interact({
				type: "SUBMIT",
				input: {
					submission: form,
					options: {
						successCallback() {
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
	useCloseWarning(
		() =>
			!(
				notification?.type === "submit_success" ||
				notification?.type === "discard_draft_success"
			) && hasDraftChanged,
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
						<Controller
							control={control}
							name={"body.english"}
							render={({ field: { onChange } }) => (
								<Editor
									model={newReadonlyModel({
										initialContent:
											lastSavedDraft?.body.english ??
											defaultBody.english,
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
								{errors.body.english.message}
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
									action() {
										confirmationDialog.interact({
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
									action: async () => {
										const {
											english: titleEnglish,
											russian: titleRussian,
										} = getValues("title");
										const {
											english: bodyEnglish,
											russian: bodyRussian,
										} = getValues("body");
										await interact({
											type: "SAVE_DRAFT",
											input: {
												draft: {
													title: {
														english: titleEnglish,
														russian:
															typeof titleRussian ===
															"string"
																? titleRussian
																: undefined,
													},
													body: {
														english: bodyEnglish,
														russian:
															typeof bodyRussian ===
															"string"
																? bodyRussian
																: undefined,
													},
												},
											},
										});
									},
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
