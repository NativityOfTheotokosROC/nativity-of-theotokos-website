import { addYears } from "date-fns";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
	LoginTooltipModel,
	LoginTooltipModelView,
} from "../models/login-tooltip";
import { Path } from "../types/general";
import { useUserInformation } from "../utilities/user";
import { usePathname } from "@/src/i18n/navigation";

type LoginTooltipOptions = Partial<{
	autoTriggerExceptions: Path[];
	duration: number;
}>;

export function useLoginTooltip(text: string, options: LoginTooltipOptions) {
	const pathname = usePathname();
	const { autoTriggerExceptions, duration } = options;
	const [loginTooltipModelView, setLoginTooltipModelView] =
		useState<LoginTooltipModelView>({
			isOpen: false,
			text,
		});
	const userInformation = useUserInformation();
	const [cookies, setCookie] = useCookies<
		"tooltipShown",
		{ tooltipShown: boolean }
	>(["tooltipShown"]);
	const [promiseWithResolvers] = useState(Promise.withResolvers());
	const loginTooltip = {
		modelView: loginTooltipModelView,
		async interact(interaction) {
			switch (interaction.type) {
				case "TRIGGER": {
					if (cookies.tooltipShown) return;
					await promiseWithResolvers.promise;
					if (userInformation && userInformation !== "pending") {
						const { promise, resolve } = Promise.withResolvers();
						setLoginTooltipModelView({
							...loginTooltipModelView,
							isOpen: true,
						});
						setTimeout(
							() => {
								setLoginTooltipModelView({
									...loginTooltipModelView,
									isOpen: false,
								});
								setCookie("tooltipShown", false, {
									expires: addYears(new Date(), 1),
								});
								resolve(null);
							},
							duration == undefined ? 5000 : duration,
						);
						await promise;
					}
				}
			}
		},
	} satisfies LoginTooltipModel;

	useEffect(() => {
		if (
			autoTriggerExceptions &&
			autoTriggerExceptions.includes(pathname as Path)
		)
			return;
		if (
			userInformation &&
			userInformation !== "pending" &&
			!cookies.tooltipShown
		) {
			async function _() {
				await loginTooltip.interact({ type: "TRIGGER" });
				setCookie("tooltipShown", false, {
					expires: addYears(new Date(), 1),
				});
			}
			_();
		}
	}, [
		autoTriggerExceptions,
		cookies.tooltipShown,
		loginTooltip,
		pathname,
		setCookie,
		userInformation,
	]);

	useEffect(() => {
		if (userInformation !== "pending")
			promiseWithResolvers.resolve(userInformation);
	}, [promiseWithResolvers, userInformation]);

	return loginTooltip;
}
