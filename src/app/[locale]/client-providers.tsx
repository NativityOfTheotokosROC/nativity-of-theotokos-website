"use client";
import { PageLoadingBarContext } from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { pageLoadingBarVIInterface } from "@/src/lib/model-implementation/page-loading-bar";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
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
	const pageLoadingBar = useNewStatefulInteractiveModel(
		pageLoadingBarVIInterface(),
	);

	return (
		<Polyfills>
			<PageLoadingBarContext.Provider value={pageLoadingBar}>
				{children}
			</PageLoadingBarContext.Provider>
		</Polyfills>
	);
};

export default ClientProviders;
