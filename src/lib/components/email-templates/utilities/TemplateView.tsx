import { TemplateViewModel } from "@/src/lib/models/template-view";
import { SOCIALS } from "@/src/lib/utilities/constants";
import { snippetify } from "@/src/lib/utilities/miscellaneous";
import { ModeledComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { Body, Container, Head, Html, Preview } from "react-email";
import EmailFooter from "./EmailFooter";

const TemplateView = function ({ model, children }) {
	const { variant, language, previewText } = model.modelView;
	return (
		<Html lang={language}>
			<Head>
				<style>{`
					:root {
						color-scheme: light dark;
						supported-color-schemes: light dark;
					}
					body {
						font-family: "Google Sans", sans-serif;
						width: 100%;
					}
					.body-content {
						background-color: #fff;
						border: solid 1px #9ca3af8e;
						border-radius: 8px;
						overflow: clip;
						color: black;
						min-width: 80%;
						width: fit-content;
						max-width: 100%;
					}
					.body-content > * {
						min-width: 100%;
					}
					@media (prefers-color-scheme: dark) {
						.body-content {
							background-color: #222222 !important;
							color: white !important;
						}
					}
				`}</style>
			</Head>
			{previewText && <Preview>{snippetify(previewText, 90)}</Preview>}
			<Body>
				<Container className="body-content">
					{children}
					<EmailFooter
						model={newReadonlyModel({
							variant,
							language,
							socials: SOCIALS,
						})}
					/>
				</Container>
			</Body>
		</Html>
	);
} satisfies ModeledComponent<InitializedModel<TemplateViewModel>>;

export default TemplateView;
