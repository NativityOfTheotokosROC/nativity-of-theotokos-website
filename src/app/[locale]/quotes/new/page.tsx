import { Metadata } from "next";
import NewQuotePageClient from "./client";

export const metadata: Metadata = {
	title: "New Quote",
};

export default function Page() {
	return <NewQuotePageClient />;
}
