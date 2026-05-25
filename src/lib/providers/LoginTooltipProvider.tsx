"use client";

import { useTranslations } from "next-intl";
import { useLoginTooltip } from "../model-implementations/login-tooltip";
import { ReadonlyModel } from "@mvc-react/mvc";
import { ModeledContainerComponent } from "@mvc-react/components";
import { Path } from "../types/general";
import { LoginTooltipContext } from "../utilities/contexts";

const LoginTooltipProvider = function ({ model, children }) {
	const { text, duration, autoTriggerExceptions } = model.modelView;
	const t = useTranslations("loginTooltip");
	const loginTooltip = useLoginTooltip(text ?? t("text"), {
		autoTriggerExceptions,
		duration,
	});

	return (
		<LoginTooltipContext.Provider value={loginTooltip}>
			{children}
		</LoginTooltipContext.Provider>
	);
} satisfies ModeledContainerComponent<
	ReadonlyModel<{
		autoTriggerExceptions?: Path[];
		text?: string;
		duration?: number;
	}>
>;

export default LoginTooltipProvider;
