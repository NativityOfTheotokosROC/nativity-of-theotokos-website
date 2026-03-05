"use client";

import { useNewQuote } from "@/src/lib/model-implementation/new-quote";
import NewQuote from "./NewQuote";

export default function NewQuotePageClient() {
	const newQuote = useNewQuote(600);
	return <NewQuote model={newQuote} />;
}
