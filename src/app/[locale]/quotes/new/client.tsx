"use client";

import { useNewQuote } from "@/src/lib/model-implementations/new-quote";
import NewQuote from "./NewQuote";

export default function NewQuoteClient() {
	const newQuote = useNewQuote();
	return <NewQuote model={newQuote} />;
}
