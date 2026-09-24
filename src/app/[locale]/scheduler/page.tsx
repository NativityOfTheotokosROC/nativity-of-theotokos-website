import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";
import SchedulerClient from "@/src/lib/components/views/scheduler/client";
import {
	getAutoCompleteInfo,
	getScheduleItems,
} from "@/src/lib/server-only/schedule";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale: rawLocale } = await params;
	const locale = isValidLocale(rawLocale) ? rawLocale : "en";
	const t = await getTranslations({ namespace: "scheduler", locale });
	return {
		title: t("title"),
	} satisfies Metadata;
}

export default async function Page() {
	await connection();
	const [scheduleItems, autoCompleteInfo] = await Promise.all([
		getScheduleItems(new Date()),
		getAutoCompleteInfo(),
	]);
	return (
		<ProtectedComponent model={newReadonlyModel({ roles: ["scheduler"] })}>
			<SchedulerClient
				model={newReadonlyModel({
					eventToEdit: { type: "specific" },
					scheduleItems,
					autoCompleteInfo,
				})}
			/>
		</ProtectedComponent>
	);
}
