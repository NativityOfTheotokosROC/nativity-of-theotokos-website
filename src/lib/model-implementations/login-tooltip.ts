import { addYears } from "date-fns";
import { useCallback, useEffect, useState } from "react";
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
	const [modelView, setLoginTooltipModelView] =
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
	const interact = useCallback(
		async interaction => {
			switch (interaction.type) {
				case "TRIGGER": {
					if (cookies.tooltipShown == true) return;
					await promiseWithResolvers.promise;
					if (userInformation && userInformation !== "pending") {
						const { promise, resolve } = Promise.withResolvers();
						setLoginTooltipModelView({
							...modelView,
							isOpen: true,
						});
						setTimeout(
							() => {
								setLoginTooltipModelView({
									...modelView,
									isOpen: false,
								});
								setCookie("tooltipShown", true, {
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
		[
			cookies.tooltipShown,
			duration,
			modelView,
			promiseWithResolvers.promise,
			setCookie,
			userInformation,
		],
	) satisfies LoginTooltipModel["interact"];

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
				await interact({ type: "TRIGGER" });
			}
			_();
		}
	}, [
		autoTriggerExceptions,
		cookies.tooltipShown,
		interact,
		pathname,
		setCookie,
		userInformation,
	]);

	useEffect(() => {
		if (userInformation !== "pending")
			promiseWithResolvers.resolve(userInformation);
	}, [promiseWithResolvers, userInformation]);

	return { modelView, interact } satisfies LoginTooltipModel;
}
