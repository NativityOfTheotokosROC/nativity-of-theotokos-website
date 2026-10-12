import { Model } from "@mvc-react/mvc";
import { Language, Text } from "../utilities/types";
import { Quote } from "./write-quote";

export type QuoteModelView = {
	quote: Quote<Text> & { id?: number };
	variant: "miniaturized" | "highlight";
	language?: Language;
	modifiers?: {
		editCallback: (id: number) => void;
		deleteCallback: (id: number) => void;
		scheduleCallback?: (id: number) => void;
	};
};

export type QuoteModel = Model<QuoteModelView>;
