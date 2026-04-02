"use client";

import { PageLoadingBarContext } from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import Error from "@/src/lib/component/page/error/Error";
import { errorPageVIInterface } from "@/src/lib/model-implementation/error-page";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { useContext, useEffect } from "react";

// export async function generateMetadata({
// 	params,
// }: LayoutProps<"/[locale]">): Promise<Metadata> {
// 	"use cache";
// 	const { locale } = await params;
// 	const t = await getTranslations({
// 		locale: hasLocale(routing.locales, locale) ? locale : "en",
// 		namespace: "error",
// 	});

// 	return {
// 		title: t("metaTitle"),
// 	};
// }

export default function Page({
	error,
}: {
	error: Error & { digest?: string };
}) {
	const message = error.digest ? `digest: ${error.digest}` : error.message;
	const pageLoadingBar = useContext(PageLoadingBarContext);
	const { modelView: errorModelView, interact: errorInteract } =
		useInitializedStatefulInteractiveModel(
			errorPageVIInterface(() => {
				window.location.reload();
			}, pageLoadingBar),
			{ message },
		);

	useEffect(() => {
		if (message != errorModelView.message)
			errorInteract({ type: "REPORT_ERROR", input: { message } });
	}, [errorInteract, errorModelView.message, message]);

	return (
		<Error
			model={{
				modelView: errorModelView,
				interact: errorInteract,
			}}
		/>
	);
}
