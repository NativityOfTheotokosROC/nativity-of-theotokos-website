import { SocialLinkModel } from "@/src/lib/models/social-link";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, ReadonlyModel } from "@mvc-react/mvc";
import SocialLink from "../../social-link/SocialLink";
import { georgia } from "@/src/lib/third-party/fonts";
import { getTranslations } from "next-intl/server";
import { Language } from "@/src/lib/utilities/types";
import { EmailFooterModel } from "@/src/lib/models/email-footer";

const EmailFooter = async function ({ model }) {
	const { socials, variant, language } = model.modelView;
	const t = await getTranslations({
		namespace: "emailFooter",
		locale: language,
	});

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
