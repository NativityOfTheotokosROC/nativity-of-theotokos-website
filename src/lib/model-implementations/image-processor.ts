import {
	ViewInteractionInterface,
	useNewStatefulInteractiveModel,
} from "@mvc-react/stateful";
import {
	ImageProcessorModel,
	ImageProcessorModelView,
	ImageProcessorNotification,
} from "../models/image-processor";
import {
	NotifierModel,
	NotifierModelView,
	NotifierModelInteraction,
} from "../models/notifier";
import { ToastNotification } from "./notifier";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { compressImage } from "../utilities/image-manipulation";

const MIN_INPUT_SIZE_KB = 10;
const MAX_INPUT_SIZE_MB = 2;
const MAX_TARGET_OUTPUT_SIZE_MB = 1;
const MAX_WIDTH_HEIGHT = 1920;

export function imageProcessorNotifierVIInterface(
	toastNotifier?: NotifierModel<ToastNotification>,
) {
	return {
		async produceModelView(interaction) {
			switch (interaction.type) {
				case "NOTIFY": {
					const { notification } = interaction.input;
					const type = notification.type;
					if (type === "processing_success") return { notification };
					await toastNotifier?.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type:
									type === "processing" ? "info" : "failure",
								message: notification.message,
							},
						},
					});
					return { notification };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NotifierModelView<ImageProcessorNotification>,
		NotifierModelInteraction<ImageProcessorNotification>
	>;
}

export function useImageProcessor(
	options?: Partial<{
		toastNotifier: NotifierModel<ToastNotification>;
		minInputSizeKB: number;
		maxInputSizeMB: number;
		maxTargetOutputSizeMB: number;
		maxWidthHeight: number;
	}>,
) {
	const t = useTranslations("imageProcessor");
	const [processedImage, setProcessedImage] =
		useState<ImageProcessorModelView["processedImage"]>(null);
	const notifier = useNewStatefulInteractiveModel(
		imageProcessorNotifierVIInterface(options?.toastNotifier),
	);

	return {
		modelView: {
			notification: notifier.modelView?.notification ?? null,
			processedImage,
		},
		async interact(interaction) {
			switch (interaction.type) {
				case "PROCESS": {
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type: "processing",
								message: t("processingImage"),
							},
						},
					});
					const { file } = interaction.input;
					const minInputSizeKB =
						options?.minInputSizeKB ?? MIN_INPUT_SIZE_KB;
					const maxInputSizeMB =
						options?.maxInputSizeMB ?? MAX_INPUT_SIZE_MB;
					const maxTargetOutputSizeMB =
						options?.maxTargetOutputSizeMB ??
						MAX_TARGET_OUTPUT_SIZE_MB;
					const maxWidthHeight =
						options?.maxWidthHeight ?? MAX_WIDTH_HEIGHT;

					if (!file.type.startsWith("image/")) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "processing_failed",
									message: t("notImage"),
								},
							},
						});
						return;
					}
					const fileSizeKB = file.size / 1024;
					const fileSizeMB = fileSizeKB / 1024;

					if (fileSizeKB < minInputSizeKB) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "processing_failed",
									message: t("imageSizeTooSmall", {
										size: fileSizeKB,
										min: minInputSizeKB,
									}),
								},
							},
						});
						return;
					}
					if (fileSizeMB > maxInputSizeMB) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "processing_failed",
									message: t("imageSizeTooBig", {
										size: fileSizeMB,
										max: maxInputSizeMB,
									}),
								},
							},
						});
						return;
					}

					try {
						const processedImage = await compressImage(file, {
							useWebWorker: true,
							maxSizeMB: maxTargetOutputSizeMB,
							maxWidthOrHeight: maxWidthHeight,
						});
						setProcessedImage(processedImage);
						await Promise.all([
							notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "processing_success",
									},
								},
							}),
							interaction.input.successCallback?.(processedImage),
						]);
					} catch (error) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "processing_failed",
									message: t("processingImageFailure", {
										message: JSON.stringify(error),
									}),
								},
							},
						});
					}
				}
			}
		},
	} satisfies ImageProcessorModel;
}
