import { ArticleAuthor, Language } from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import EmailContent from "../utilities/EmailContent";
import EmailHeader from "../utilities/EmailHeader";
import TemplateView from "../utilities/TemplateView";
import { Button, Container, Text } from "react-email";
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
				<Container className="flex flex-col gap-4">
					<Text className="text-3xl font-semibold">
						{t("alternativeTitle")}
					</Text>
					<Text>{t("message", { author: author.name })}</Text>
					<Button
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
