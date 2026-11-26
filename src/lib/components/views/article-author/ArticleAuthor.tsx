import { ArticleAuthorModel } from "@/src/lib/models/article-author";
import {
	ArticleAuthor as ArticleAuthorType,
	Translation,
} from "@/src/lib/utilities/types";
import {
	getArticleAuthorSchema,
	NewArticleAuthor,
} from "@/src/lib/validation/article";
import { useLocalizedSchema } from "@/src/lib/validation/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import PageView from "../../page-view/PageView";
import Spinner from "../../spinner/Spinner";
import Button from "../../button/Button";
import {
	BLANK_TRANSLATION,
	DEFAULT_ARTICLE_PREVIEW_IMAGE,
	DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER,
	DEFAULT_PROFILE_PHOTO,
	DEFAULT_PROFILE_PHOTO_PLACEHOLDER,
} from "@/src/lib/utilities/constants";
import { useConfirmationDialog } from "@/src/lib/model-implementations/confirmation-dialog";
import ConfirmationDialog from "../../confirmation-dialog/ConfirmationDialog";
import ButtonBar from "../../button-bar/ButtonBar";
import { useFileSelector } from "@/src/lib/model-implementations/file-selector";
import { useImageUploader } from "@/src/lib/model-implementations/image-uploader";
import { useCloseWarning } from "@/src/lib/client-only/miscellaneous";
import { Check, X } from "lucide-react";
import FileSelectorButton from "../../file-selector-button/FileSelectorButton";
import Image from "next/image";

const ArticleAuthor = function ({ model }) {
	const { modelView, interact } = model;
	const t = useTranslations("articleAuthor");
	const tMisc = useTranslations("miscellaneous");
	const tSelect = useTranslations("imageSelector");
	const articleAuthorSchema = useLocalizedSchema(getArticleAuthorSchema);
	const {
		setValue,
		handleSubmit,
		reset,
		control,
		register,
		formState: { isDirty, isSubmitting, errors },
	} = useForm({
		resolver: zodResolver(articleAuthorSchema),
		defaultValues: getDefaultValues(modelView?.author),
	});
	const confirmationDialog = useConfirmationDialog();
	const imageUploader = useImageUploader();
	const imageSelector = useFileSelector({
		type: "image",
		async selectCallback(file) {
			if (!isSubmitting)
				await imageUploader.interact({
					type: "UPLOAD",
					input: {
						file,
						successCallback(imageUrl) {
							setValue("profile.picture", imageUrl);
						},
					},
				});
		},
	});
	const imageUploaderNotification = imageUploader.modelView.notification;

	useCloseWarning(() => isDirty);

	return (
		<>
			<ConfirmationDialog model={confirmationDialog} />
			<PageView model={newReadonlyModel({ title: t("title") })}>
				<form
					onSubmit={handleSubmit(async form => {
						await interact({
							type: "ADD_AUTHOR",
							input: {
								id: modelView?.author?.id,
								author: form,
								successCallback(newAuthor) {
									reset(getDefaultValues(newAuthor));
								},
							},
						});
					})}
				>
					<div className="flex flex-col gap-x-10 gap-y-4 md:flex-row lg:max-w-3/4 @max-xl:w-full">
						<>
							<Controller
								control={control}
								name="profile.picture"
								render={({
									field: { value, ref },
									fieldState: { error },
								}) => (
									<div className="flex flex-col gap-3">
										<div
											className="flex size-[15em] items-stretch justify-stretch overflow-clip rounded-lg"
											ref={ref}
											tabIndex={0}
										>
											<Image
												className="h-full w-full grow object-cover object-center"
												src={
													imageUploader.modelView
														.processedImage
														?.blobURL ??
													(value &&
													typeof value === "string"
														? value
														: DEFAULT_PROFILE_PHOTO)
												}
												placeholder="blur"
												blurDataURL={
													modelView?.author?.profile
														?.picture
														?.placeholder ??
													DEFAULT_PROFILE_PHOTO_PLACEHOLDER
												}
												alt={t("profilePicture")}
												unoptimized={true}
											/>
										</div>
										{error && (
											<span className="text-sm text-red-800">
												{error.message}
											</span>
										)}
										<div className="flex flex-col gap-3">
											<FileSelectorButton
												model={newReadonlyModel({
													fileSelector: imageSelector,
													contents: modelView?.author
														?.profile?.picture
														? tSelect("changeImage")
														: tSelect(
																"selectImage",
															),
													contentsWhenFile:
														tSelect("changeImage"),
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
									</div>
								)}
							/>
						</>
						<div className="flex flex-1 flex-col gap-3">
							<>
								<input
									{...register("name.english")}
									lang="en"
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.name?.english ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("nameField")}
									autoCapitalize="words"
								/>
								{errors.name?.english && (
									<span className="text-sm text-red-800">
										{errors.name.english.message}
									</span>
								)}
							</>
							<>
								<input
									{...register("name.russian")}
									lang="ru"
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.name?.russian ? "border-red-800" : "border-gray-400"}`}
									placeholder={`${t("nameField")} (${tMisc("russian")})`}
									autoCapitalize="words"
								/>
								{errors.name?.russian && (
									<span className="text-sm text-red-800">
										{errors.name.russian.message}
									</span>
								)}
							</>
							<>
								<input
									{...register("email")}
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.email ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("email")}
									type="email"
								/>
								{errors.email && (
									<span className="text-sm text-red-800">
										{errors.email.message}
									</span>
								)}
							</>
							<hr className="mt-10 w-full" />
							<>
								<textarea
									{...register("profile.description.english")}
									lang="en"
									className={`w-full resize-none rounded-lg border bg-white p-4 ${errors.profile?.description?.english ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("descriptionField")}
									rows={5}
								/>
								{errors.profile?.description?.english && (
									<span className="text-sm text-red-800">
										{
											errors.profile.description.english
												.message
										}
									</span>
								)}
							</>
							<>
								<textarea
									{...register("profile.description.russian")}
									lang="ru"
									className={`w-full resize-none rounded-lg border bg-white p-4 ${errors.profile?.description?.russian ? "border-red-800" : "border-gray-400"}`}
									placeholder={`${t("descriptionField")} (${tMisc("russian")})`}
									rows={5}
								/>
								{errors.profile?.description?.russian && (
									<span className="text-sm text-red-800">
										{
											errors.profile.description.russian
												.message
										}
									</span>
								)}
							</>
							<>
								<input
									{...register("profile.contactEmail")}
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.profile?.contactEmail ? "border-red-800" : "border-gray-400"}`}
									placeholder={`${t("contactEmailField")} (${tMisc("optional")})`}
									type="email"
								/>
								{errors.profile?.contactEmail && (
									<span className="text-sm text-red-800">
										{errors.profile.contactEmail.message}
									</span>
								)}
							</>
						</div>
					</div>
					<hr className="mt-14 mb-10 w-full" />
					<ButtonBar
						model={newReadonlyModel({
							arrangement: "start",
							orientation: "horizontal",
						})}
					>
						<Button
							model={newReadonlyModel({
								type: "button",
								disabled: isSubmitting,
								action: () => {
									if (modelView?.author) {
										const author = modelView.author;
										confirmationDialog.interact({
											type: "OPEN",
											input: {
												message: t(
													"deleteProfileConfirmation",
												),
												proceedCallback: () =>
													handleSubmit(() =>
														interact({
															type: "DELETE_PROFILE",
															input: {
																id: author.id,
																successCallback() {
																	reset(
																		getDefaultValues(
																			{
																				...author,
																				profile:
																					undefined,
																			},
																		),
																	);
																},
															},
														}),
													),
											},
										});
									}
								},
							})}
							className="min-w-[8em]"
						>
							{t("deleteProfile")}
						</Button>
						<Button
							model={newReadonlyModel({
								type: "submit",
								disabled: isSubmitting,
							})}
							className="min-w-[8em]"
						>
							{isSubmitting ? (
								<Spinner
									model={newReadonlyModel({
										color: "white",
										size: 20,
									})}
								/>
							) : modelView?.author ? (
								t("updateAuthor")
							) : (
								t("addAuthor")
							)}
						</Button>
					</ButtonBar>
				</form>
			</PageView>
		</>
	);
} satisfies ModeledVoidComponent<ArticleAuthorModel>;

export default ArticleAuthor;

function getDefaultValues(author?: ArticleAuthorType<Translation>) {
	return {
		name: author?.name ?? BLANK_TRANSLATION,
		email: author?.email ?? "",
		profile: {
			description: author?.profile?.description ?? BLANK_TRANSLATION,
			picture: author?.profile?.picture?.source ?? "",
			contactEmail: author?.profile?.contactEmail ?? "",
		},
	} satisfies NewArticleAuthor;
}
