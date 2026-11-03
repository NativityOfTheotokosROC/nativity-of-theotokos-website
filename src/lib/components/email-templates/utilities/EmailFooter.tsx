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
		<Container className="email-footer flex flex-col gap-4 bg-[#0a0a0a] p-9 text-sm text-white">
			{variant.type === "broadcast" && (
				<Text className="text-sm">
					{t.rich("broadcastDisclaimer", {
						unsub: text => <a href={variant.unsubLink}>{text}</a>,
						pref: text => <a href={variant.unsubLink}>{text}</a>,
					})}
				</Text>
			)}
			{variant.type === "transactional" &&
				variant.includeIgnoreMessage && (
					<Text className="text-sm">{t("ignoreMessage")}</Text>
				)}
			<Hr className="mt-6 opacity-50" />
			{socials && socials.length && (
				<Container className="social-links flex gap-5 text-lg **:size-4 **:hover:text-[#ffdc4f]">
					{socials.map(social => (
						<SocialLink
							key={social.modelView.details.link}
							model={social}
						/>
					))}
				</Container>
			)}
			<Text className="copyright w-fit text-sm">
				<Text className={georgia.className}>&copy;</Text>{" "}
				{t("copyright")}
			</Text>
		</Container>
	);
} satisfies ModeledVoidComponent<InitializedModel<EmailFooterModel>>;

export default EmailFooter;
