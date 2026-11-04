import { TemplateViewModel } from "@/src/lib/models/template-view";
import { SOCIALS } from "@/src/lib/utilities/constants";
import { ModeledComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { Body, Container, Font, Head, Html, Preview } from "react-email";
import EmailFooter from "./EmailFooter";
import { snippetify } from "@/src/lib/utilities/miscellaneous";

const TemplateView = function ({ model, children }) {
	const { variant, language, previewText } = model.modelView;
	return (
		<Html lang={language}>
			<Head>
				<Font
					fontFamily="Google Sans"
					fallbackFontFamily="Arial"
					webFont={{
						url: "https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap",
						format: "woff2",
					}}
					fontStyle="normal"
					fontWeight={400}
				/>
				<style>{`
					:root {
						color-scheme: light dark;
						supported-color-schemes: light dark;
					}
					body {
						font-family: "Google Sans", sans-serif
					}
					.body-content {
						background-color: #FEF8F3;
						border: solid 1px #9ca3af8e;
						border-radius: 8px;
						overflow: clip;
						color: black;
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
