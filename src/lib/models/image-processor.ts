import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../types/general";

export type ImageProcessorNotification =
	| (Notification<"processing" | "processing_failed"> & { message: string })
	| Notification<"processing_success">;

export type ImageProcessorModelView = {
	processedImage: File | null;
	notification: ImageProcessorNotification | null;
};

export type ImageProcessorModelInteraction = InputModelInteraction<
	"PROCESS",
	{ file: File }
>;

export type ImageProcessorModel = InteractiveModel<
	ImageProcessorModelView,
	ImageProcessorModelInteraction
>;
