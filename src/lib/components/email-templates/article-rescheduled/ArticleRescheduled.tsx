import { Language } from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Container, Heading, Text } from "react-email";
import EmailContent from "../utilities/EmailContent";
import EmailHeader from "../utilities/EmailHeader";
import TemplateView from "../utilities/TemplateView";
import { pickFullDateTimeTranslation } from "@/src/lib/utilities/date-time";
import { removeMarkup } from "@/src/lib/utilities/miscellaneous";
import { renderToString } from "react-dom/server";

const ArticleRescheduled = async function ({ model }) {
	const { language, recipientName, articleTitle, oldDate, newDate } =
		model.modelView;
	const t = await getTranslations({
		namespace: "articleRescheduled",
		locale: language,
	});
	const message = t.rich("message", {
		name: recipientName,
		title: articleTitle,
		oldDate: pickFullDateTimeTranslation(oldDate, language, true, true),
		newDate: pickFullDateTimeTranslation(newDate, language, true, true),
		emphasis: innerHtml => (
			<span style={{ fontWeight: 600 }}>{innerHtml}</span>
		),
	});

	return (
		<TemplateView
			model={newReadonlyModel({
				language,
				variant: { type: "transactional", includeIgnoreMessage: true },
				previewText: removeMarkup(renderToString(message)),
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
		recipientName: string;
		articleTitle: string;
		oldDate: Date;
		newDate: Date;
	}>
>;

export default ArticleRescheduled;
