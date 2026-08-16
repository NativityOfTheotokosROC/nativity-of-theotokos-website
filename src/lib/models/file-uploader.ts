import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../types/general";

export type FileUploaderNotification = Notification<
	"uploading" | "upload_success" | "upload_fail"
> & {
	message: string;
};

export type FileUploaderModelView = {
	uploadedFileUrl: string | null;
	notification: FileUploaderNotification | null;
};

export type FileUploaderModelInteraction = InputModelInteraction<
	"UPLOAD",
	{
		file: File;
		presignedUrl: string;
		successCallback?: (imageUrl: string) => Promise<void>;
	}
>;

export type FileUploaderModel = InteractiveModel<
	FileUploaderModelView,
	FileUploaderModelInteraction
>;
