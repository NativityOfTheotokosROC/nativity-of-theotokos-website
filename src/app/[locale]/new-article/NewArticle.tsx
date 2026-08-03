"use client";

import Button from "@/src/lib/components/button/Button";
import Editor from "@/src/lib/components/editor/Editor";
import Spinner from "@/src/lib/components/spinner/Spinner";
import { useEditor } from "@/src/lib/model-implementations/editor";
import { NewArticleModel } from "@/src/lib/models/new-article";
import { georgia } from "@/src/lib/third-party/fonts";
import { useCloseWarning } from "@/src/lib/utilities/hooks";
import { useArticleFormSchema } from "@/src/lib/validation/article-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

const NewArticle = function ({ model }) {
	const { modelView, interact } = model;
	const { ticketId, newArticleNotification, lastSavedDraft } = modelView;
	const t = useTranslations("newArticle");
	const defaultTitle = "";
	const defaultBody = `<p>${t("bodyPlaceholder")}</p>`;
	const articleFormSchema = useArticleFormSchema();
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
		className: errors.body ? "border-red-800" : "border-gray-400",
	});
	const title = watch("title");
	const body = editor.modelView.content;
	// const previewAuthor = author ?? t("unknownAuthor");
	const hasDraftChanged = lastSavedDraft
		? !(title === lastSavedDraft.title && body === lastSavedDraft.body)
		: !(title === defaultTitle && body === defaultBody);

	useCloseWarning(useCallback(() => hasDraftChanged, [hasDraftChanged]));

	return (
		<main className="new-quote border-t-15 border-t-[#976029] bg-[#FEF8F3] text-black">
			<div className="new-quote-content flex flex-col gap-6 p-8 py-9 md:py-10 lg:px-20">
				<span
					className={`mb-2 text-[2.75rem]/tight font-semibold md:text-black ${georgia.className}`}
				>
					{t("metaTitle")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<form
					onSubmit={handleSubmit(
						async form =>
							await interact({
								type: "SUBMIT",
								input: {
									draft: {
										ticketId,
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
							}),
					)}
				>
					<div className="flex flex-col gap-3">
						<input
							{...register("title")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.title ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("title")}
							autoComplete="off"
							autoCapitalize="words"
						/>
						{errors.title && (
							<span className="text-sm text-red-800">
								{errors.title.message}
							</span>
						)}
						<Editor model={editor} />
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
						<hr className="mt-1 w-full" />
						<div className="mt-1 flex w-full justify-start gap-3">
							<Button
								model={newReadonlyModel({
									type: "button",
									disabled: !hasDraftChanged,
									className: "w-fit max-w-1/2 min-w-[8em]",
									action: async () =>
										interact({
											type: "SAVE_DRAFT",
											input: {
												draft: {
													ticketId,
													title,
													body,
												},
											},
										}),
								})}
							>
								{newArticleNotification?.type ===
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
							{/* <Button
								model={newReadonlyModel({
									type: "button",
									disabled: !isValid,
									className: "w-fit max-w-1/2 min-w-[8em]",
									action: handleSubmit(async form =>
										interact({
											type: "PREVIEW",
											input: {
												author: previewAuthor,
												title: form.title,
												body: form.body,
											},
										}),
									),
								})}
							>
								{t("preview")}
							</Button> */}
							<Button
								model={newReadonlyModel({
									type: "submit",
									variant: "standard",
									disabled:
										isSubmitting ||
										newArticleNotification?.type ===
											"submitting",
									className:
										"w-fit flex items-center justify-center max-w-1/2 min-w-[8em]",
								})}
							>
								{newArticleNotification?.type ===
								"submitting" ? (
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
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<NewArticleModel>>;

export default NewArticle;
