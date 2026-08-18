import { ModeledContainerComponent } from "@mvc-react/components";
import { InformationViewModel } from "../../models/information-view";
import { InitializedModel } from "@mvc-react/mvc";
import { georgia } from "../../third-party/fonts";
import PageView from "../page-view/PageView";
import { useEffect } from "react";

const InformationView = function ({ model, children }) {
	const { mainMessage, detailedMessage, Graphic } = model.modelView;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<PageView model={{ modelView: null }}>
			<div className="information-view flex h-full grow justify-center text-center">
				<div className="flex w-md flex-col items-center justify-center gap-6 landscape:h-[70svh]">
					<Graphic className="h-64 w-80 fill-black opacity-90 md:h-48" />
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{mainMessage}
					</span>
					<span className="text-lg">{detailedMessage}</span>
					{children} {/*TODO: Make children optional mvc-react */}
				</div>
			</div>
		</PageView>
	);
} satisfies ModeledContainerComponent<InitializedModel<InformationViewModel>>;

export default InformationView;
