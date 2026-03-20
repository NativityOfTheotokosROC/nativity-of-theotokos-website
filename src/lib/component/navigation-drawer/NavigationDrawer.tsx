import { ModeledVoidComponent } from "@mvc-react/components";
import { NavigationDrawerModel } from "../../model/navigation-drawer";

const NavigationDrawer = function ({ model }) {
	const { isDrawn, type, navlinks, user } = model.modelView;

	return <div className={`navigation-drawer ${!isDrawn && "hidden"}`}></div>;
} satisfies ModeledVoidComponent<NavigationDrawerModel>;

export default NavigationDrawer;
