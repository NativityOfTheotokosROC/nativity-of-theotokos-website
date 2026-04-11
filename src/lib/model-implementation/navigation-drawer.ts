import { InitializedModel } from "@mvc-react/mvc";
import { useState } from "react";
import { NavigationDrawerModel } from "../model/navigation-drawer";
import { Navlink } from "../type/general";

export function useNavigationDrawer(
	navlinks: Navlink[],
	hasUserNavigationWidget: boolean,
) {
	const [isDrawn, setIsDrawn] = useState(false);
	return {
		modelView: { isDrawn, navlinks, hasUserNavigationWidget },
		interact(interaction) {
			switch (interaction.type) {
				case "OPEN": {
					setIsDrawn(true);
					break;
				}
				case "CLOSE": {
					setIsDrawn(false);
					break;
				}
				case "TOGGLE": {
					setIsDrawn(currentState => !currentState);
					break;
				}
				default: {
					throw new Error(
						`Invalid interaction? ${interaction.type satisfies never}`,
					);
				}
			}
		},
	} satisfies InitializedModel<NavigationDrawerModel>;
}
