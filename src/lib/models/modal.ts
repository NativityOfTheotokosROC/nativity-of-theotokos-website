import { Model } from "@mvc-react/mvc";

export type ModalModelView = {
	isOpen: boolean;
	title: string;
	onClose: () => Promise<void>;
};

export type ModalModel = Model<ModalModelView>;
