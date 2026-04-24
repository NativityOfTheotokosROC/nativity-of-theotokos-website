"use client";

import { PageLoadingBarContext } from "@/src/lib/components/page-loading-bar/PageLoadingBar";
import Error from "@/src/lib/components/views/error/Error";
import { errorPageVIInterface } from "@/src/lib/model-implementations/error-page";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { useContext, useEffect } from "react";

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
