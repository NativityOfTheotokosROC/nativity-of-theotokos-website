import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	UserNavigationWidgetModelInteraction,
	UserNavigationWidgetModelView,
} from "../model/user-navigation-widget";
import { signOut } from "../third-party/better-auth";
import { useRouter } from "next/navigation";

export function userNavigationWidgetVIInterface(
	router: ReturnType<typeof useRouter>,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "SIGN_OUT": {
					if (!currentModelView)
						throw new Error("Model is unitialized");
					await signOut();
					router.push("/");
					return { ...currentModelView }; // TODO: Revisit
				}
			}
		},
	} satisfies ViewInteractionInterface<
		UserNavigationWidgetModelView,
		UserNavigationWidgetModelInteraction
	>;
}
