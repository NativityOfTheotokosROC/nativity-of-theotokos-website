import { routing } from "@/src/i18n/routing";
import { Suspense } from "react";
import CatchAll from "./CatchAll";

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }));
}

export default async function Page(props: PageProps<"/[locale]/[...rest]">) {
	<Suspense fallback={null}>
		<CatchAll {...props} />
	</Suspense>;
}
