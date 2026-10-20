import { Model } from "@mvc-react/mvc";

export type ModalModelView = {
	isOpen: boolean;
	title: string;
	variant?: "titled" | "titled-with-close" | "blank";
	size: "smallest" | "small" | "medium" | "large";
	position?: "top" | "center";
	onClose: () => void;
};

export type ModalModel = Model<ModalModelView>;
