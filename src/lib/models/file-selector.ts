import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type FileType = "image" | "audio" | "video";

export type FileSelectorModelView = {
	file: File | null;
	type?: FileType;
};

export type FileSelectorModelInteraction = InputModelInteraction<
	"SELECT_FILE",
	{ file: File }
>;

export type FileSelectorModel = InteractiveModel<
	FileSelectorModelView,
	FileSelectorModelInteraction
>;
