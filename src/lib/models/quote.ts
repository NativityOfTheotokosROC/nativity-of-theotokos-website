import { Model } from "@mvc-react/mvc";
import { Language, Text } from "../utilities/types";
import { Quote } from "./new-quote";

export type QuoteModelView = {
	quote: Quote<Text>;
	language?: Language;
};

export type QuoteModel = Model<QuoteModelView>;
