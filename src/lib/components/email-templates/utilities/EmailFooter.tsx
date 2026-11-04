import { EmailFooterModel } from "@/src/lib/models/email-footer";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import SocialLink from "../../social-link/SocialLink";
import { Container, Hr, Text } from "react-email";

const EmailFooter = async function ({ model }) {
	const { socials, variant, language } = model.modelView;
	const t = await getTranslations({
		namespace: "emailFooter",
		locale: language,
	});

	return (
		<Container
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "16px",
				backgroundColor: "#0a0a0a",
				color: "white",
				padding: "36px",
				fontSize: "14px",
				lineHeight: "20px",
			}}
			className="email-footer"
		>
			{variant.type === "broadcast" && (
				<Text>
					{t.rich("broadcastDisclaimer", {
						unsub: text => <a href={variant.unsubLink}>{text}</a>,
						pref: text => <a href={variant.unsubLink}>{text}</a>,
					})}
				</Text>
			)}
			{variant.type === "transactional" &&
				variant.includeIgnoreMessage && (
					<Text>{t("ignoreMessage")}</Text>
				)}
			<Hr style={{ marginTop: "24px", opacity: 0.5 }} />
			{socials && socials.length && (
				<Container
					style={{ display: "flex", gap: "20px" }}
					className="social-links"
				>
					{socials.map(social => (
						<SocialLink
							key={social.modelView.details.link}
							model={social}
						/>
					))}
				</Container>
			)}
			<Text className="copyright">
				<Text className={georgia.className}>&copy;</Text>{" "}
				{t("copyright")}
			</Text>
		</Container>
	);
} satisfies ModeledVoidComponent<InitializedModel<EmailFooterModel>>;

export default EmailFooter;
