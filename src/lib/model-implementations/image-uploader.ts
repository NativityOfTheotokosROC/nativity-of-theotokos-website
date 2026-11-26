import { ImageUploaderModel } from "../models/image-uploader";
import { getPresignedUrl } from "../server-actions/file-transfer";
import { generateUniqueName } from "../utilities/miscellaneous";
import { useFileUploader } from "./file-uploader";
import { useImageProcessor } from "./image-processor";

export function useImageUploader(
	options?: Partial<{
		imageProcessorOptions: Parameters<typeof useImageProcessor>[0];
		fileUploaderOptions: Parameters<typeof useFileUploader>[0];
	}>,
) {
	const imageProcessor = useImageProcessor(options?.imageProcessorOptions);
	const fileUploader = useFileUploader(options?.fileUploaderOptions);

	const notificationType =
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
	const notificationMessage =
		imageProcessor.modelView.notification?.type === "processing" ||
		imageProcessor.modelView.notification?.type === "processing_success" ||
		imageProcessor.modelView.notification?.type === "processing_failed"
			? imageProcessor.modelView.notification.message
			: (fileUploader.modelView.notification?.message ?? null);

	return {
		modelView: {
			processedImage: imageProcessor.modelView.processedImage,
			uploadedFileUrl: fileUploader.modelView.uploadedFileUrl,
			notification:
				//TODO: Sloppy
				notificationType && notificationMessage
					? { type: notificationType, message: notificationMessage }
					: null,
		},
		async interact(interaction) {
			switch (interaction.type) {
				case "UPLOAD": {
					const { file, successCallback } = interaction.input;
					await imageProcessor.interact({
						type: "PROCESS",
						input: {
							file,
							async successCallback(processedImage, extension) {
								const presignedUrl = await getPresignedUrl(
									`${generateUniqueName()}${extension ? `.${extension}` : ""}`,
									"news",
									processedImage.type,
								);
								await fileUploader.interact({
									type: "UPLOAD",
									input: {
										file: processedImage,
										presignedUrl,
										successCallback(imageUrl) {
											successCallback?.(imageUrl);
										},
									},
								});
							},
						},
					});
				}
			}
		},
	} satisfies ImageUploaderModel;
}
