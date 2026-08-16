import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type FileType = "image" | "audio" | "video";

export type FileSelectorButtonModelView = {
	file: File | null;
	type?: FileType;
};

export type FileSelectorButtonModelInteraction = InputModelInteraction<
	"SELECT_FILE",
	{ file: File }
>;

export type FileSelectorButtonModel = InteractiveModel<
	FileSelectorButtonModelView,
	FileSelectorButtonModelInteraction
>;
