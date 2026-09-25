import { Model } from "@mvc-react/mvc";
import { Options } from "../utilities/types";

export type Radio<K extends string> = {
	id: K;
	text: string;
};

export type RadioGroupModelView<K extends string> = {
	selected: Radio<K>;
	items: Radio<K>[];
	selectedChangedCallback?: (selected: Radio<K>) => void;
} & Options<{
	orientation: "vertical" | "horizontal";
	className?: string;
}>;

export type RadioGroupModel<K extends string = string> = Model<
	RadioGroupModelView<K>
>;
