import { EmailFooterModel } from "@/src/lib/models/email-footer";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Hr, Section, Text } from "react-email";

const EmailFooter = async function ({ model }) {
	const { variant, language } = model.modelView;
	const t = await getTranslations({
		namespace: "emailFooter",
		locale: language,
	});

	return (
		<Section
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
			{variant.type === "broadcast" ||
				(variant.type === "new_sub" && (
					<Text>
						{t.rich("broadcastDisclaimer", {
							unsub: text => (
								<a href={variant.unsubLink}>{text}</a>
							),
							pref: text => (
								<a href={variant.prefsLink}>{text}</a>
							),
						})}
					</Text>
				))}
			{variant.type === "transactional" &&
				variant.includeIgnoreMessage && (
					<Text>{t("ignoreMessage")}</Text>
				)}
			<Hr style={{ marginTop: "24px", opacity: 0.5 }} />
			<Text className="copyright">&copy; {t("copyright")}</Text>
		</Section>
	);
} satisfies ModeledVoidComponent<InitializedModel<EmailFooterModel>>;

export default EmailFooter;
