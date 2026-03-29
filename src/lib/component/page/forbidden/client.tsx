"use client";

import { useRouter } from "@/src/i18n/navigation";
import { usePageLoadingBarRouter } from "@/src/lib/utility/page-loading-bar";
import { useForbidden } from "@/src/lib/model-implementation/forbidden";
import Forbidden from "./Forbidden";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ForbiddenClientModel } from "@/src/lib/model/forbidden-client";

const ForbiddenClient = function ({ model }) {
	const { signOutEndpoint } = model.modelView;

	const forbidden = useForbidden(
		usePageLoadingBarRouter(useRouter),
		signOutEndpoint,
	);

	return <Forbidden model={forbidden} />;
} satisfies ModeledVoidComponent<ForbiddenClientModel>;

export default ForbiddenClient;
