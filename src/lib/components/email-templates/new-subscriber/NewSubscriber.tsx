import { Language } from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Container, Heading, Text } from "react-email";
import EmailContent from "../utilities/EmailContent";
import EmailHeader from "../utilities/EmailHeader";
import TemplateView from "../utilities/TemplateView";

const NewSubscriber = async function ({ model }) {
	const { language, prefsLink, unsubLink } = model.modelView;
	const t = await getTranslations({
		namespace: "newSubscriber",
		locale: language,
	});
	const message = t("message");

	return (
		<TemplateView
			model={newReadonlyModel({
				language,
				variant: { type: "new_sub", prefsLink, unsubLink },
				previewText: message,
			})}
		>
			<EmailHeader model={newReadonlyModel({ language })} />
			<EmailContent>
				<Container
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "16px",
					}}
				>
					<Heading
						as="h1"
						style={{ fontSize: "30px", fontWeight: "600" }}
					>
						{t("title")}
					</Heading>
					<Text>{message}</Text>
				</Container>
			</EmailContent>
		</TemplateView>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{
		language: Language;
		prefsLink: string;
		unsubLink: string;
	}>
>;

export default NewSubscriber;
