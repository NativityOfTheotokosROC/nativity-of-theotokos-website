"use client";
import { PageLoadingBarContext } from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { pageLoadingBarVIInterface } from "@/src/lib/model-implementation/page-loading-bar";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import {
	NavigationUserInformationContext,
	useNavigationUserInformation,
} from "../utility/user";

const Polyfills = dynamic(
	() => import("@/src/lib/component/miscellaneous/polyfills"),
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
	const navigationUserInformation = useNavigationUserInformation(queryClient);

	return (
		<QueryClientProvider client={queryClient}>
			<PageLoadingBarContext.Provider value={pageLoadingBar}>
				<NavigationUserInformationContext
					value={navigationUserInformation}
				>
					<Polyfills>{children}</Polyfills>
				</NavigationUserInformationContext>
			</PageLoadingBarContext.Provider>
		</QueryClientProvider>
	);
};

export default ClientProviders;
