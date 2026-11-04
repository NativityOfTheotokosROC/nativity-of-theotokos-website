import { ModeledComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { Body, Head, Html, pixelBasedPreset, Tailwind } from "react-email";
import EmailFooter from "./EmailFooter";
import { TemplateViewModel } from "@/src/lib/models/template-view";
import { SOCIALS } from "@/src/lib/utilities/constants";
import { googleSans, googleSansFlex } from "@/src/lib/third-party/fonts";

const TemplateView = function ({ model, children }) {
	const { variant, language } = model.modelView;
	return (
		<Html lang={language}>
			<Head>
				<style>{`
					body {
						background-color: #FEF8F3;
						color: black;
					}
					@media (prefers-color-scheme: dark) {
						body {
							background-color: #222222;
							color: white;
						}
					}
				`}</style>
			</Head>
			<Body>
				{children}
				<EmailFooter
					model={newReadonlyModel({
						variant,
						language,
						socials: SOCIALS,
					})}
				/>
			</Body>
		</Html>
	);
} satisfies ModeledComponent<InitializedModel<TemplateViewModel>>;

export default TemplateView;
