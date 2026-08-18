import { Model } from "@mvc-react/mvc";

export type ModalModelView = {
	isOpen: boolean;
	title: string;
	size: "smallest" | "small" | "medium" | "large";
	position?: "top" | "center";
	onClose: () => Promise<void>;
};

export type ModalModel = Model<ModalModelView>;
