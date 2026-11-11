"use client";

import { ModeledComponent } from "@mvc-react/components";
import { InformationViewModel } from "../../models/information-view";
import { InitializedModel } from "@mvc-react/mvc";
import { georgia } from "../../third-party/fonts";
import PageView from "../page-view/PageView";
import { useEffect } from "react";

const InformationView = function ({ model, children }) {
	const { mainMessage, detailedMessage, Graphic, topBarColor } =
		model.modelView;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<PageView model={{ modelView: { topBarColor } }}>
			<div className="information-view flex h-full min-h-fit grow justify-center text-center">
				<div className="flex w-md flex-col items-center justify-center gap-6 landscape:h-[70svh]">
					<Graphic className="h-64 min-h-64 w-80 fill-black opacity-90 md:h-48 md:min-h-48" />
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{mainMessage}
					</span>
					{detailedMessage && (
						<span className="text-lg">{detailedMessage}</span>
					)}
					{children}
				</div>
			</div>
		</PageView>
	);
} satisfies ModeledComponent<InitializedModel<InformationViewModel>>;

export default InformationView;
