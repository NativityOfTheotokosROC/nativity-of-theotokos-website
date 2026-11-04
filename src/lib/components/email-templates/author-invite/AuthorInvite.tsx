import { ArticleAuthor, Language } from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import EmailContent from "../utilities/EmailContent";
import EmailHeader from "../utilities/EmailHeader";
import TemplateView from "../utilities/TemplateView";
import { Button, Container, Heading, Text } from "react-email";
import { getTranslations } from "next-intl/server";

const AuthorInvite = async function ({ model }) {
	const { language, author, articleLink } = model.modelView;
	const t = await getTranslations({
		namespace: "authorInvite",
		locale: language,
	});

	return (
		<TemplateView
			model={newReadonlyModel({
				language,
				variant: { type: "transactional", includeIgnoreMessage: true },
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
						{t("alternativeTitle")}
					</Heading>
					<Text>{t("message", { author: author.name })}</Text>
					<Button
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							backgroundColor:
								"color-mix(in srgb, #250203 82%, transparent)",
						}}
						className="flex items-center justify-center bg-[#250203]/82"
						href={articleLink}
					>
						{t("writeArticleButton")}
					</Button>
				</Container>
			</EmailContent>
		</TemplateView>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{
		language: Language;
		author: ArticleAuthor;
		articleLink: string;
	}>
>;

export default AuthorInvite;
