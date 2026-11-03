import { ModeledComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { pixelBasedPreset, Tailwind } from "react-email";
import EmailFooter from "./EmailFooter";
import { TemplateViewModel } from "@/src/lib/models/template-view";
import { SOCIALS } from "@/src/lib/utilities/constants";

const TemplateView = function ({ model, children }) {
	const { variant, language } = model.modelView;
	console.log("rendering template view");
	return (
		<>
			{/* <Tailwind config={{ presets: [pixelBasedPreset] }}> */}
			{children}
			<EmailFooter
				model={newReadonlyModel({
					variant,
					language,
					socials: SOCIALS,
				})}
			/>
			{/* </Tailwind> */}
		</>
	);
} satisfies ModeledComponent<InitializedModel<TemplateViewModel>>;

export default TemplateView;
