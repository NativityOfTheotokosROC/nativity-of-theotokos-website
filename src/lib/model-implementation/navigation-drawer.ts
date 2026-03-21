import { InitializedModel } from "@mvc-react/mvc";
import { useState } from "react";
import {
	NavigationDrawerModel,
	NavigationDrawerType,
} from "../model/navigation-drawer";
import { MenuItems } from "../model/navigation-menu";

export function useNavigationDrawer(
	menuItems: MenuItems,
	type: NavigationDrawerType,
) {
	const [isDrawn, setIsDrawn] = useState(false);
	return {
		modelView: { navMenuItems: menuItems, isDrawn, type },
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
