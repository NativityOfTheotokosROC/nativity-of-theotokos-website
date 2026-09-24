import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../utilities/types";

export type ImageProcessorNotification =
	| (Notification<"processing" | "processing_failed"> & { message: string })
	| Notification<"processing_success">;

export type ImageProcessorModelView = {
	processedImage: {
		file: File;
		blobURL: string;
	} | null;
	notification: ImageProcessorNotification | null;
};

export type ImageProcessorModelInteraction = InputModelInteraction<
	"PROCESS",
	{
		file: File;
		successCallback?: (processedImage: File, extension: string) => void;
	}
>;

export type ImageProcessorModel = InteractiveModel<
	ImageProcessorModelView,
	ImageProcessorModelInteraction
>;
