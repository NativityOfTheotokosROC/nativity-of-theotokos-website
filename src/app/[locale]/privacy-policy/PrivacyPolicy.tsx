import { georgia } from "@/src/lib/third-party/fonts";
import { Language } from "@/src/lib/types/general";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";

const PrivacyPolicy = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({
		locale: language,
		namespace: "privacyPolicy",
	});
	const dateLocale = language == "ru" ? "ru-RU" : "en-UK";

	return (
		<main className="privacy-policy border-t-15 border-t-orange-800 bg-[#FEF8F3] text-black">
			<div className="privacy-policy-content flex flex-col gap-6 p-8 py-9 md:px-20 md:py-10 lg:w-3/4">
				<span
					className={`mb-2 text-[2.75rem]/tight font-semibold wrap-break-word hyphens-auto md:w-3/4 ${georgia.className}`}
				>
					{t("title")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<span className="text-sm">{`${t("lastModified")}: ${new Date("2026-04-25").toLocaleDateString(dateLocale, { dateStyle: "medium" })}`}</span>
				<div className="flex flex-col gap-6 [&_a]:underline [&_a]:hover:text-[#dcb042] [&_a]:active:text-[#dcb042]">
					<section className="flex flex-col gap-3">
						<p>
							Protecting your private information is our priority.
							This Privacy Policy applies to the Nativity of the
							Theotokos Russian Orthodox Church{" "}
							{"('we', 'us', or 'our') "}
							website, https://www.nativityoftheotokos.com and
							governs data collection and usage. For the purposes
							of this Privacy Policy, unless otherwise noted, all
							references to Nativity of the Theotokos Russian
							Orthodox Church, include the above mentioned
							website.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Collection of your Personal Information
						</span>
						<p>
							Nativity of the Theotokos Russian Orthodox Church
							collects your name, email address and profile
							picture when you sign into our website through the
							third-party authentication providers we expose:
							examples including Google OAuth 2.0 and Microsoft
							OAuth 2.0. We collect your email address and
							possibly your name when you subscribe to our mailing
							list or correspond with us.
						</p>
						<p>
							We encourage you to review the privacy statements of
							websites you choose to link to from the Nativity of
							the Theotokos Russian Orthodox Church website so
							that you may understand how those websites collect,
							use and share your information. Nativity of the
							Theotokos Russian Orthodox Church is not responsible
							for the privacy statements or other content on
							websites outside of the Nativity of the Theotokos
							Russian Orthodox Church website.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Use of your Personal Information
						</span>
						<p>
							Nativity of the Theotokos Russian Orthodox Church
							collects and uses your personal information to:
							authenticate you; authorize you to access specific
							services; and to deliver services specifically
							requested by you. Nativity of the Theotokos Russian
							Orthodox Church may also use your personally
							identifiable information to inform you of other
							products or services available from the church. Our
							email marketing is permission-based and we will only
							send you information relevant to what you opted-in
							or signed up for. You may choose to cancel your
							email subscription at any time. Nativity of the
							Theotokos Russian Orthodox Church does not sell,
							rent or lease its customer lists to third parties.
							Nativity of the Theotokos Russian Orthodox Church
							may share data with trusted partners to help perform
							statistical analysis, to send you email, and to
							provide customer support. All such third parties are
							prohibited from using your personal information
							except to provide these services to Nativity of the
							Theotokos Russian Orthodox Church, and they are
							required to maintain the confidentiality of your
							information.
						</p>
						<p>
							Nativity of the Theotokos Russian Orthodox Church
							may keep track of the pages our users visit within
							the Nativity of the Theotokos Russian Orthodox
							Church website in order to determine what content,
							and services are the most popular. This data is used
							to deliver customized content within the Nativity of
							the Theotokos Russian Orthodox Church website to
							users whose behavior indicates that they are
							interested in particular services or subject areas.
						</p>
						<p>
							Nativity of the Theotokos Russian Orthodox Church
							will disclose your personal information, without
							notice, only if required to do so by law or in the
							good faith belief that such action is necessary to:
							(a) conform to the edicts of the law or comply with
							legal process served on Nativity of the Theotokos
							Russian Orthodox Church; (b) protect and defend the
							rights or property of Nativity of the Theotokos
							Russian Orthodox Church; and, (c) act under exigent
							circumstances to protect the personal safety of
							users of the Nativity of the Theotokos Russian
							Orthodox Church website or the public.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">Cookies</span>
						<p>
							Cookies are small pieces of data stored on your
							device by your browser. They serve various purposes,
							such as remembering your preferences, enhancing user
							experience, and facilitating authentication.
						</p>
						<p>
							Nativity of Theotokos Russian Orthodox Church uses
							first-party cookies to store your preferences, and
							enhance your user experience. We also utilize
							third-party authentication services, including
							Google OAuth 2.0 and Microsoft OAuth 2.0, to secure
							and streamline the login process. When you log in
							using OAuth 2.0, a cookie is generated and stored on
							your device. This cookie is essential for the proper
							functioning of our authentication system.
						</p>
						<p>
							The cookie contains a unique identifier that helps
							us recognize your authenticated session. It enables
							you to access our application seamlessly without the
							need to re-enter your credentials repeatedly during
							a single session.
						</p>
						<p>
							It is important to note that these cookies DO NOT
							store your actual login credentials on our servers
							or on your browser. Instead, they serve as tokens
							that establish a secure connection between your
							browser and the authentication provider. This
							enhances the security of the authentication process
							while providing a more user-friendly experience.
						</p>
						<p>
							By using our site and opting for third-party
							authentication, you consent to the use of cookies
							for authentication purposes. You can manage your
							cookie preferences through your browser settings.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Security of your Personal Information
						</span>
						<p>
							We value your trust in providing us your Personal
							Information, and we implement industry-standard
							security measures and best-practices to the best of
							our abilities in order to protect it. However, no
							method of transmission over the internet, or method
							of electronic storage is 100% secure and reliable,
							and we cannot guarantee its absolute security.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Children Under Thirteen
						</span>
						<p>
							Nativity of the Theotokos Russian Orthodox Church
							does not knowingly collect personally identifiable
							information from children under the age of thirteen.
							If you are under the age of thirteen, you must ask
							your parent or guardian for permission to use this
							website.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Opt-out, Unsubscribe and Delete your Data
						</span>
						<p>
							We respect your privacy and give you an opportunity
							to opt-out of receiving email updates and to delete
							your data. Users may opt-out of receiving any or all
							communications from Nativity of the Theotokos
							Russian Orthodox Church, and request personal data
							deletion by contacting us via{" "}
							<a href="mailto:info@nativityoftheotokos.com">
								email
							</a>
							.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Changes to this Policy
						</span>
						<p>
							Nativity of the Theotokos Russian Orthodox Church
							will occasionally update this Statement of Privacy
							to reflect church and user feedback. This will be
							reflected by a {'"Last Updated"'} date at the top of
							the page. We encourage you to periodically review
							this Policy to be informed of how Nativity of the
							Theotokos Russian Orthodox Church is protecting your
							information.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Contact Information
						</span>
						<p>
							For more information about our privacy practices, if
							you have questions, or if you would like to make a
							complaint, please{" "}
							<a href="mailto:info@nativityoftheotokos.com">
								reach out to us
							</a>
							.
						</p>
					</section>
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default PrivacyPolicy;
