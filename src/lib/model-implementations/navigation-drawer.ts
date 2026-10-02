import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	NavigationDrawerModel,
	NavigationDrawerModelInteraction,
	NavigationDrawerModelView,
} from "../models/navigation-drawer";
import { UninitializedModelError } from "../utilities/errors";
import { Navlink } from "../utilities/types";

function navigationDrawerVIInterface() {
	return {
		async produceModelView(interaction, currentModelView) {
			if (!currentModelView) throw new UninitializedModelError();
			switch (interaction.type) {
				case "OPEN": {
					return { ...currentModelView, isDrawn: true };
				}
				case "CLOSE": {
					return { ...currentModelView, isDrawn: false };
				}
				case "TOGGLE": {
					return {
						...currentModelView,
						isDrawn: !currentModelView.isDrawn,
					};
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NavigationDrawerModelView,
		NavigationDrawerModelInteraction
	>;
}

export function useNavigationDrawer(navlinks: Navlink[]) {
	const model = useInitializedStatefulInteractiveModel(
		navigationDrawerVIInterface(),
		{ isDrawn: false, navlinks },
	);
	return model satisfies NavigationDrawerModel;
}
