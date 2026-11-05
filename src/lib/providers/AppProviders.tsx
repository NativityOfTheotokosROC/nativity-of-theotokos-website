"use client";

import { ModeledComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Messages, NextIntlClientProvider } from "next-intl";
import { Language, Path } from "../utilities/types";
import LoginTooltipProvider from "./LoginTooltipProvider";
import PageLoadingBarProvider from "./PageLoadingBarProvider";

const queryClient = new QueryClient();

export const AppProviders = function ({ model, children }) {
	const { locale, messages } = model.modelView;
	const autoTriggerExceptions: Path[] = ["/", "/ru"];
	return (
		<QueryClientProvider client={queryClient}>
			<NextIntlClientProvider
				locale={locale}
				messages={messages}
				timeZone="UTC"
			>
				<PageLoadingBarProvider>
					<LoginTooltipProvider
						model={newReadonlyModel({ autoTriggerExceptions })}
					>
						{children}
					</LoginTooltipProvider>
				</PageLoadingBarProvider>
			</NextIntlClientProvider>
		</QueryClientProvider>
	);
} satisfies ModeledComponent<
	ReadonlyModel<{ locale?: Language; messages?: Messages }>
>;

export default AppProviders;
