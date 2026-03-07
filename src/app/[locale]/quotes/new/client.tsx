"use client";

import { useNewQuote } from "@/src/lib/model-implementation/new-quote";
import NewQuote from "./NewQuote";

export default function NewQuoteClient() {
	const newQuote = useNewQuote(600);
	return <NewQuote model={newQuote} />;
}
