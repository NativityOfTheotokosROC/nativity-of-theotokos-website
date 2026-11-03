import { EmailFooterModel } from "@/src/lib/models/email-footer";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import SocialLink from "../../social-link/SocialLink";

const EmailFooter = async function ({ model }) {
	console.log("rendering footer");
	const { socials, variant, language } = model.modelView;
	const t = await getTranslations({
		namespace: "emailFooter",
		locale: language,
	});
	console.log("(almost) rendered footer");

	return (
		<footer className="email-footer flex flex-col gap-4 bg-[#0a0a0a] p-9 text-sm text-white">
			{variant.type === "broadcast" && (
				<span className="text-sm">
					{t.rich("broadcastDisclaimer", {
						unsub: text => <a href={variant.unsubLink}>{text}</a>,
						pref: text => <a href={variant.unsubLink}>{text}</a>,
					})}
				</span>
			)}
			{variant.type === "transactional" &&
				variant.includeIgnoreMessage && (
					<span className="text-sm">{t("ignoreMessage")}</span>
				)}
			<hr className="mt-6 opacity-50" />
			{socials && socials.length && (
				<div className="social-links flex gap-5 text-lg **:size-4 **:hover:text-[#ffdc4f]">
					{socials.map(social => (
						<SocialLink
							key={social.modelView.details.link}
							model={social}
						/>
					))}
				</div>
			)}
			<span className="copyright w-fit text-sm">
				<span className={georgia.className}>&copy;</span>{" "}
				{t("copyright")}
			</span>
		</footer>
	);
} satisfies ModeledVoidComponent<InitializedModel<EmailFooterModel>>;

export default EmailFooter;
