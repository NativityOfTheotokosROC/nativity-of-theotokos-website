import { Quote } from "../models/new-quote";
import { Text, ReplacePropertyType } from "./types";

export type DetailedQuote<T extends Text = string> = ReplacePropertyType<
	Quote<T>,
	"author",
	QuoteAuthor<T>
> & {
	id: number;
};
export type QuoteAuthor<T extends Text = string> = { id: number; name: T };
