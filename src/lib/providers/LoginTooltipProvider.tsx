"use client";

import { useTranslations } from "next-intl";
import { useLoginTooltip } from "../model-implementations/login-tooltip";
import { ReadonlyModel } from "@mvc-react/mvc";
import { ModeledComponent } from "@mvc-react/components";
import { Path } from "../utilities/types";
import { LoginTooltipContext } from "../utilities/contexts";

const LoginTooltipProvider = function ({ model, children }) {
	const {
		text,
		duration,
		autoTriggerExceptions,
		id = "login-tooltip",
	} = model.modelView;
	const t = useTranslations("loginTooltip");
	const loginTooltip = useLoginTooltip(id, text ?? t("text"), {
		autoTriggerExceptions,
		duration,
	});

	return (
		<LoginTooltipContext.Provider value={loginTooltip}>
			{children}
		</LoginTooltipContext.Provider>
	);
} satisfies ModeledComponent<
	ReadonlyModel<{
		id?: string;
		autoTriggerExceptions?: Path[];
		text?: string;
		duration?: number;
	}>
>;

export default LoginTooltipProvider;
