import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	FileUploaderModel,
	FileUploaderModelInteraction,
	FileUploaderModelView,
	FileUploaderNotification,
} from "../models/file-uploader";
import {
	NotifierModelView,
	NotifierModelInteraction,
	NotifierModel,
} from "../models/notifier";
import { ToastNotification } from "./notifier";
import { useState } from "react";
import { uploadFile } from "../client-only/file-uploader";
import { useTranslations } from "next-intl";
import { getPresignedUrl } from "../server-actions/file-transfer";

export function fileUploaderNotifierVIInterface(
	toastNotifier?: NotifierModel<ToastNotification>,
) {
	return {
		async produceModelView(interaction) {
			switch (interaction.type) {
				case "NOTIFY": {
					const { notification } = interaction.input;
					const type = notification.type;
					await toastNotifier?.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type:
									type === "uploading"
										? "info"
										: type === "upload_success"
											? "success"
											: "failure",
								message: notification.message,
							},
						},
					});
					return { notification };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NotifierModelView<FileUploaderNotification>,
		NotifierModelInteraction<FileUploaderNotification>
	>;
}

export function useFileUploader(
	toastNotifier?: NotifierModel<ToastNotification>,
) {
	const t = useTranslations("fileUploader");
	const notifier = useNewStatefulInteractiveModel(
		fileUploaderNotifierVIInterface(toastNotifier),
	);
	const [uploadedFileUrl, setUploadedFileUrl] =
		useState<FileUploaderModelView["uploadedFileUrl"]>(null);
	return {
		modelView: {
			uploadedFileUrl,
			notification: notifier.modelView?.notification ?? null,
		},
		async interact(interaction) {
			switch (interaction.type) {
				case "UPLOAD": {
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type: "uploading",
								message: t("uploadingFile"),
							},
						},
					});
					const { file, presignedUrl } = interaction.input;
					try {
						const url = await uploadFile(file, presignedUrl);
						setUploadedFileUrl(url);
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "upload_success",
									message: t("uploadFileSuccess"),
								},
							},
						});
					} catch (error) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "upload_fail",
									message: t("uploadFileFailure", {
										message: JSON.stringify(error),
									}),
								},
							},
						});
					}
				}
			}
		},
	} satisfies FileUploaderModel;
}
