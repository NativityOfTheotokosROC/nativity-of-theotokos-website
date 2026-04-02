"use client";
import { PageLoadingBarContext } from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { pageLoadingBarVIInterface } from "@/src/lib/model-implementation/page-loading-bar";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import dynamic from "next/dynamic";

const Polyfills = dynamic(
	() => import("@/src/lib/component/miscellaneous/polyfills"),
	{ ssr: false },
);

export const ClientProviders = function ({
	children,
}: {
	children: React.ReactNode;
}) {
	const pageLoadingBar = useInitializedStatefulInteractiveModel(
		pageLoadingBarVIInterface(),
		{ isLoading: false },
	);

	return (
		<PageLoadingBarContext.Provider value={pageLoadingBar}>
			<Polyfills>{children}</Polyfills>
		</PageLoadingBarContext.Provider>
	);
};

export default ClientProviders;
