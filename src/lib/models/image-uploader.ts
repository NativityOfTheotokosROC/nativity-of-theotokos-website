import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification, Unravel } from "../utilities/types";
import { FileUploaderModelView } from "./file-uploader";
import { ImageProcessorModelView } from "./image-processor";

export type ImageUploaderModelView = Unravel<
	Omit<ImageProcessorModelView, "notification"> &
		Omit<FileUploaderModelView, "notification"> & {
			notification:
				| (Notification<"processing" | "success" | "error"> & {
						message: string;
				  })
				| null;
		}
>;

export type ImageUploaderModelInteraction = InputModelInteraction<
	"UPLOAD",
	{ file: File; successCallback?: (imageUrl: string) => void }
>;

export type ImageUploaderModel = InteractiveModel<
	ImageUploaderModelView,
	ImageUploaderModelInteraction
>;
