import { Model } from "@mvc-react/mvc";

export type ModalModelView = {
	isOpen: boolean;
	title: string;
	onClose: () => void;
	size: "smallest" | "small" | "medium" | "large";
	variant?: "titled" | "titled-with-close" | "blank";
	position?: "top" | "center";
	interceptSubmit?: boolean;
};

export type ModalModel = Model<ModalModelView>;
