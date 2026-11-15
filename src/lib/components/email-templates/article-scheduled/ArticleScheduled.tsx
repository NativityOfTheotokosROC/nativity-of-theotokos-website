import { Language } from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Container, Heading, Img, Text } from "react-email";
import EmailContent from "../utilities/EmailContent";
import EmailHeader from "../utilities/EmailHeader";
import TemplateView from "../utilities/TemplateView";

const ArticleScheduled = async function ({ model }) {
	const {
		language,
		message,
		articlePreview: { title, image, snippet },
	} = model.modelView;
	const t = await getTranslations({
		namespace: "articleScheduledEmail",
		locale: language,
	});

	return (
		<TemplateView
			model={newReadonlyModel({
				language,
				variant: { type: "transactional", includeIgnoreMessage: true },
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
					<Text>{message}</Text>
					<Img
						style={{
							borderRadius: "8px",
							overflow: "clip",
							height: "400px",
							width: "600px",
							maxWidth: "100%",
							objectFit: "cover",
							objectPosition: "center",
						}}
						className="article-image"
						alt="Article Image"
						src={image}
						height={400}
					/>
					<Heading
						as="h1"
						style={{ fontSize: "26px", fontWeight: "600" }}
					>
						{title}
					</Heading>
					<Text style={{ fontSize: "20px" }}>{t("snippet")}</Text>
					<Text>{snippet}</Text>
				</Container>
			</EmailContent>
		</TemplateView>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{
		language: Language;
		message: string;
		articlePreview: {
			title: string;
			image: string;
			snippet: string;
			link: string;
		};
	}>
>;

export default ArticleScheduled;
