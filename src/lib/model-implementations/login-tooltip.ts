import { usePathname } from "@/src/i18n/navigation";
import { addYears } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import {
	LoginTooltipModel,
	LoginTooltipModelView,
} from "../models/login-tooltip";
import { Path } from "../types/general";
import { useUserInformation } from "../utilities/user";

type LoginTooltipOptions = Partial<{
	autoTriggerExceptions: Path[];
	duration: number;
}>;

export const LOGIN_TOOLTIP_COOKIE_NAME = "tooltipShown";

export function useLoginTooltip(text: string, options: LoginTooltipOptions) {
	const [modelView, setLoginTooltipModelView] =
		useState<LoginTooltipModelView>({
			isOpen: false,
			text,
		});
	const pathname = usePathname();
	const { autoTriggerExceptions, duration } = options;
	const userInformation = useUserInformation();

	const interact = useCallback(
		async interaction => {
			switch (interaction.type) {
				case "TRIGGER": {
					const cookie = await window.cookieStore.get(
						LOGIN_TOOLTIP_COOKIE_NAME,
					);
					if (cookie && cookie.value == "true") return;
					if (userInformation && userInformation !== "pending") {
						const { promise, resolve } = Promise.withResolvers();
						setLoginTooltipModelView({
							...modelView,
							isOpen: true,
						});
						setTimeout(
							async () => {
								setLoginTooltipModelView({
									...modelView,
									isOpen: false,
								});
								await window.cookieStore.set({
									name: LOGIN_TOOLTIP_COOKIE_NAME,
									value: "true",
									expires: addYears(new Date(), 1).getTime(),
								});
								resolve(null);
							},
							duration == undefined ? 4000 : duration,
						);
						await promise;
					}
				}
			}
		},
		[duration, modelView, userInformation],
	) satisfies LoginTooltipModel["interact"];

	useEffect(() => {
		if (
			autoTriggerExceptions &&
			autoTriggerExceptions.includes(pathname as Path)
		)
			return;
		window.cookieStore.get(LOGIN_TOOLTIP_COOKIE_NAME).then(cookie => {
			if (
				userInformation &&
				userInformation !== "pending" &&
				cookie?.value != "true"
			) {
				async function _() {
					await interact({ type: "TRIGGER" });
				}
				_();
			}
		});
	}, [autoTriggerExceptions, interact, pathname, userInformation]);

	return { modelView, interact } satisfies LoginTooltipModel;
}
