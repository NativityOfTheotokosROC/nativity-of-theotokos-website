"use client";
import { PageLoadingBarContext } from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { pageLoadingBarVIInterface } from "@/src/lib/model-implementation/page-loading-bar";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { UserInformationContext, useUserInformation } from "../utility/user";

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
	console.log("Client providers run");

	const pageLoadingBar = useInitializedStatefulInteractiveModel(
		pageLoadingBarVIInterface(),
		{ isLoading: false },
	);
	const userInformation = useUserInformation(queryClient);

	return (
		<QueryClientProvider client={queryClient}>
			<PageLoadingBarContext.Provider value={pageLoadingBar}>
				<UserInformationContext.Provider value={userInformation}>
					<Polyfills>{children}</Polyfills>
				</UserInformationContext.Provider>
			</PageLoadingBarContext.Provider>
		</QueryClientProvider>
	);
};

export default ClientProviders;
