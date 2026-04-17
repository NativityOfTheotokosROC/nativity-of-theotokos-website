"use client";
import { PageLoadingBarContext } from "@/src/lib/components/page-loading-bar/PageLoadingBar";
import { pageLoadingBarVIInterface } from "@/src/lib/model-implementations/page-loading-bar";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const Polyfills = dynamic(
	() => import("@/src/lib/components/miscellaneous/polyfills"),
	{ ssr: false },
);

const queryClient = new QueryClient();

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
		<QueryClientProvider client={queryClient}>
			<PageLoadingBarContext.Provider value={pageLoadingBar}>
				<Polyfills>{children}</Polyfills>
			</PageLoadingBarContext.Provider>
		</QueryClientProvider>
	);
};

export default ClientProviders;
