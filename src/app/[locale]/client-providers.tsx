"use client";

import { LoadingBarContext } from "@/src/lib/component/loading-bar/LoadingBar";
import { loadingBarVIInterface } from "@/src/lib/model-implementation/loading-bar";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";

export const ClientProviders = function ({
	children,
}: {
	children: React.ReactNode;
}) {
	const loadingBarModel = useNewStatefulInteractiveModel(
		loadingBarVIInterface(),
	);

	return (
		<LoadingBarContext.Provider value={loadingBarModel}>
			{children}
		</LoadingBarContext.Provider>
	);
};

export default ClientProviders;
