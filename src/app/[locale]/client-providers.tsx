"use client";

import { LoadingBarContext } from "@/src/lib/component/loading-bar/LoadingBar";
import { loadingBarVIInterface } from "@/src/lib/model-implementation/loading-bar";
import { ClientProvidersModel } from "@/src/lib/model/client-providers";
import { ModeledContainerComponent } from "@mvc-react/components";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";

export const ClientProviders = function ({ children }) {
	const loadingBarModel = useNewStatefulInteractiveModel(
		loadingBarVIInterface(),
	);

	return (
		<LoadingBarContext.Provider value={loadingBarModel}>
			{children}
		</LoadingBarContext.Provider>
	);
} satisfies ModeledContainerComponent<ClientProvidersModel>;

export default ClientProviders;
