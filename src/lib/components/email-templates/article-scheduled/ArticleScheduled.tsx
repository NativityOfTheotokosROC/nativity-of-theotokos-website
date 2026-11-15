import { Language } from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Container, Heading, Hr, Img, Text } from "react-email";
import EmailContent from "../utilities/EmailContent";
import EmailHeader from "../utilities/EmailHeader";
import TemplateView from "../utilities/TemplateView";
import style from "styled-jsx/style";

const ArticleScheduled = async function ({ model }) {
	const {
		language,
		title,
		message,
		articlePreview: { title: articleTitle, image, snippet },
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
					<Heading
						as="h1"
						style={{ fontSize: "30px", fontWeight: "600" }}
					>
						{title}
					</Heading>
					<Text>{message}</Text>
					<Hr style={{ marginBottom: "24px", opacity: 0.5 }} />
					<Img
						style={{
							borderRadius: "8px",
							overflow: "clip",
							height: "auto",
							maxHeight: "240px",
							width: "300px",
							maxWidth: "100%",
							objectFit: "cover",
							objectPosition: "center",
						}}
						className="article-image"
						alt="Article Image"
						src={image}
						height={240}
					/>
					<Heading
						as="h2"
						style={{ fontSize: "26px", fontWeight: "600" }}
					>
						{articleTitle}
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
		title: string;
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
