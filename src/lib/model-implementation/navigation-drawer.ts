import { InitializedModel } from "@mvc-react/mvc";
import { useState } from "react";
import { NavigationDrawerModel } from "../model/navigation-drawer";
import { MenuItems } from "../type/miscellaneous";

export function useNavigationDrawer(menuItems: MenuItems) {
	const [isDrawn, setIsDrawn] = useState(false);
	return {
		modelView: { isDrawn, navMenuItems: menuItems },
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
