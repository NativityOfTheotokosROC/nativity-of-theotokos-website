"use client";

import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { CookiesProvider } from "react-cookie";
import { Language, Path } from "../types/general";
import LoginTooltipProvider from "./LoginTooltipProvider";
import PageLoadingBarProvider from "./PageLoadingBarProvider";
import { ModeledContainerComponent } from "@mvc-react/components";
import { Messages, NextIntlClientProvider } from "next-intl";

const Polyfills = dynamic(
	() => import("@/src/lib/components/miscellaneous/polyfills"),
	{ ssr: false },
);

const queryClient = new QueryClient();

export const AppProvider = function ({ model, children }) {
	const { locale, messages } = model.modelView;
	const autoTriggerExceptions: Path[] = ["/", "/ru"];
	return (
		<QueryClientProvider client={queryClient}>
			<CookiesProvider>
				<NextIntlClientProvider
					locale={locale}
					messages={messages}
					timeZone="UTC"
				>
					<PageLoadingBarProvider>
						<LoginTooltipProvider
							model={newReadonlyModel({ autoTriggerExceptions })}
						>
							<Polyfills>{children}</Polyfills>
						</LoginTooltipProvider>
					</PageLoadingBarProvider>
				</NextIntlClientProvider>
			</CookiesProvider>
		</QueryClientProvider>
	);
} satisfies ModeledContainerComponent<
	ReadonlyModel<{ locale?: Language; messages?: Messages }>
>;

export default AppProvider;
