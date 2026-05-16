import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Language } from "../../../lib/types/general";
import { Link } from "@/src/lib/components/page-loading-bar/PageLoadingBar";

const TermsOfService = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({
		locale: language,
		namespace: "termsOfService",
	});
	const dateLocale = language == "ru" ? "ru-RU" : "en-UK";

	return (
		<main className="terms-of-service border-t-15 border-t-red-900 bg-[#FEF8F3] text-black">
			<div className="terms-of-service-content flex flex-col gap-6 p-8 py-9 md:px-20 md:py-10 lg:w-3/4">
				<span
					className={`mb-2 text-[2.75rem]/tight font-semibold wrap-break-word hyphens-auto md:w-3/4 ${georgia.className}`}
				>
					{t("title")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<span className="text-sm">{`${t("lastModified")}: ${new Date("2026-05-09").toLocaleDateString(dateLocale, { dateStyle: "medium" })}`}</span>
				<div className="flex flex-col gap-6 [&_a]:underline [&_a]:hover:text-[#ffdc4f] [&_a]:active:text-[#ffdc4f]">
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">Liability</span>
						<p>
							Our commitment to providing this service is founded
							on the principles of transparency and user
							responsibility. It is important to understand the
							following regarding liability:
						</p>
						<p>
							<strong>No Warranty or Guarantee: </strong> We
							provide this service &#x27;as-is&#x27; and without
							any warranty or guarantee. While we make every
							effort to ensure the functionality, security, and
							reliability of our site, we do not make any
							representations or warranties regarding the
							accuracy, completeness, or suitability of the
							information and materials found or offered on this
							website.
						</p>
						<p>
							<strong>Exclusion of Liability: </strong> In no
							event shall we be liable for any direct, indirect,
							incidental, consequential, special, or exemplary
							damages, including but not limited to, damages for
							loss of goodwill, use, data, or other intangible
							losses, resulting from the use or inability to use
							our services.
						</p>
						<p>
							<strong>User Responsibility: </strong> You
							acknowledge and agree that your use of this service
							is at your own risk. We are not responsible for any
							damages or issues that may arise, including but not
							limited to, data loss, system errors, or
							interruptions in service. It is your responsibility
							to take appropriate precautions and ensure that any
							services or information obtained through our site
							meet your specific requirements.
						</p>
						<p>
							<strong>Indemnification: </strong> By using this
							service, you agree to indemnify and hold us harmless
							from any claims, actions, damages, liabilities,
							costs, and expenses, including reasonable
							attorneys&#x27; fees, arising out of or in
							connection with your use of the service or any
							violation of these terms.
						</p>
						<p>
							It&#x27;s important to review and understand these
							terms fully. If you do not agree with any part of
							these terms, your only recourse is to discontinue
							your use of the service.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">Account</span>
						<p>
							By creating an account on this website, you
							acknowledge and agree to the following terms
							regarding your account:
						</p>
						<p>
							<strong>Account Management: </strong> We reserve the
							right to manage your account at our discretion. This
							includes the right to delete, suspend, or lock your
							account and associated data without prior notice.
							Such actions may be taken for reasons including, but
							not limited to, violation of our terms of service,
							suspected fraudulent activities, or any other
							actions that may compromise the security and
							integrity of our platform.
						</p>
						<p>
							<strong>Termination: </strong> We may terminate or
							suspend your account for any reason, including
							breach of these terms. In the event of termination,
							you will no longer have access to your account and
							any data associated with it. We are not liable for
							any loss or damage that may result from the
							termination of your account.
						</p>
						<p>
							<strong>Account Security: </strong> It is your
							responsibility to maintain the security of your
							account credentials. You agree not to share your
							login information with third parties. You are solely
							responsible for any activities that occur under your
							account.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Uptime, Security, and Privacy
						</span>
						<p>
							By using this service, you acknowledge and agree to
							the following terms related to uptime, security, and
							privacy:
						</p>
						<p>
							<strong>Uptime: </strong> While we strive to
							maintain the availability of our services, we do not
							provide any service level agreement (SLA). The
							website&#x27;s uptime may be subject to occasional
							interruptions, including maintenance, updates, or
							unforeseen technical issues. Your use of this
							service is at your own risk, and we do not guarantee
							uninterrupted access to our platform.
						</p>
						<p>
							<strong>Security: </strong> We implement reasonable
							security measures to protect the integrity of our
							platform. However, you acknowledge that no online
							service can be completely secure. We do not assume
							responsibility for any unauthorized access, data
							breaches, or other security incidents that may
							occur. It is your responsibility to take appropriate
							measures to secure your account and data.
						</p>
						<p>
							<strong>Privacy: </strong> Your privacy is important
							to us. Our privacy practices are outlined in our
							separate{" "}
							<Link href="/privacy-policy">Privacy Policy</Link>,
							which is an integral part of these terms. By using
							our services, you agree to the collection, use, and
							disclosure of your information as described in the
							Privacy Policy. It is your responsibility to review
							the Privacy Policy and understand how your data is
							handled.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Features and Bugs
						</span>
						<p>
							Our commitment to providing a quality service
							involves continuous efforts to enhance features and
							address any bugs. It&#x27;s important to be aware of
							the following regarding features and bugs:
						</p>
						<p>
							<strong>Continuous Improvement: </strong> We are
							dedicated to continuously adding new features and
							improving existing functionalities to enhance your
							experience. By agreeing to our terms, you
							acknowledge that the system may undergo changes over
							time to introduce new features or enhance existing
							ones.
						</p>
						<p>
							<strong>Bug Fixes: </strong> Bugs are an inevitable
							part of any software system. While we strive to
							maintain a seamless experience, you understand that
							bugs may be identified and fixed during the course
							of our ongoing development efforts. We appreciate
							your understanding and cooperation in reporting any
							issues you may encounter.
						</p>
						<p>
							<strong>Impact on User Experience: </strong> Changes
							to the system, including the introduction of new
							features or bug fixes, may impact your overall
							experience. By agreeing to our terms, you accept
							that such changes are inherent in the nature of
							software development, and we cannot guarantee that
							your experience will remain unchanged.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Use of Third Party Services
						</span>
						<p>
							<strong>Third-Party Services: </strong> We utilize
							third-party services to employ authentication,
							receive donations, handle email campaigns, and to
							retrieve daily readings. It&#x27;s crucial to note
							that these third-party services are independent
							entities, and we are not responsible for their
							operations, performance, or any consequences arising
							from their use.
						</p>
						<p>
							<strong>No Affiliation: </strong> We want to make it
							explicitly clear that we are not affiliated with the
							third-party services we employ. Any issues or
							concerns related to their services should be
							directed to the respective third-party providers.
						</p>
						<p>
							<strong>User Responsibility: </strong> Compliance
							with local laws and regulations is essential, and
							you acknowledge that we do not assume responsibility
							for any legal implications arising from your use of
							the service.
						</p>
					</section>
					<section className="flex flex-col gap-3">
						<span className="text-xl font-semibold">
							Updates to Terms of Service
						</span>
						<p>
							To ensure transparency and compliance, it&#x27;s
							important to be aware of our policy regarding
							updates to the terms of service:
						</p>
						<p>
							<strong>Right to Update: </strong> We reserve the
							right to update these terms of service at any time.
							Updates may be made to reflect changes in our
							services, legal requirements, or other
							considerations. Your continued use of our
							application after any such changes constitutes your
							acceptance of the modified terms.
						</p>
						<p>
							<strong>No Obligation to Notify: </strong> While we
							may make efforts to communicate significant changes,
							you agree that we are not obligated to notify users
							individually when updates occur. It is your
							responsibility to check back on these terms
							periodically to stay informed about any
							modifications.
						</p>
						<p>
							<strong>Review of Terms: </strong> It&#x27;s
							advisable to review these terms regularly to ensure
							that you are aware of any changes that may affect
							your use of the application. Your continued use of
							the service after updates indicates your agreement
							to be bound by the modified terms.
						</p>
					</section>
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default TermsOfService;
