"use client";

import LogoIcon from "@/public/assets/logo-icon.svg";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { Fragment } from "react/jsx-runtime";
import { FooterModel } from "../../models/footer";
import { georgia } from "../../third-party/fonts";
import { formatPhoneNumber } from "../../utilities/miscellaneous";
import { Link } from "../page-loading-bar/PageLoadingBar";
import SocialLink from "../social-link/SocialLink";
import FooterSection from "./FooterSection";

const Footer = function ({ model }) {
	const {
		description,
		parishEmail,
		jurisdictionInfo,
		clergy,
		contacts,
		socials,
		copyrightText,
		bottomLinks,
	} = model.modelView;
	const t = useTranslations("footer");

	return (
		<footer id="footer" className="w-full max-w-full">
			<div className="footer-content flex flex-col gap-4 bg-[#0a0a0a] p-9 text-sm text-white">
				<div className="footer-sections flex flex-col gap-x-14 gap-y-8 md:flex-row">
					<div className="flex flex-col gap-6 md:flex-row">
						<LogoIcon className="logo-icon size-17.5 min-w-17.5" />
						<FooterSection
							model={newReadonlyModel({
								title: t("heading"),
							})}
						>
							<div className="flex flex-col gap-5">
								<p>{description}</p>
								<span>
									{`${t("email")}: `}
									<a
										className="hover:underline"
										href={`mailto:${parishEmail}`}
									>
										{parishEmail}
									</a>
								</span>
								<div className="social-links flex gap-5 text-lg **:size-4 **:hover:text-[#DCB042]">
									{[
										...socials.map(social => (
											<SocialLink
												key={
													social.modelView.details
														.link
												}
												model={social}
											/>
										)),
									]}
								</div>
							</div>
						</FooterSection>
					</div>
					<div className="flex grow flex-col gap-x-18 gap-y-8 md:flex-row md:flex-wrap">
						<FooterSection
							model={newReadonlyModel({
								title: t("jurisdictional"),
							})}
						>
							<div className="flex flex-col gap-2">
								<span>
									<a
										className="hover:underline"
										href={jurisdictionInfo.diocese.link}
										target="_blank"
									>
										{jurisdictionInfo.diocese.name}
									</a>
								</span>
								<span>
									<a
										className="hover:underline"
										href={jurisdictionInfo.metropolis.link}
										target="_blank"
									>
										{jurisdictionInfo.metropolis.name}
									</a>
								</span>
								<span>
									<a
										className="hover:underline"
										href={jurisdictionInfo.patriarch.link}
										target="_blank"
									>
										{jurisdictionInfo.patriarch.name}
									</a>
								</span>
								<span>
									<a
										className="hover:underline"
										href={
											jurisdictionInfo.patriarchate.link
										}
										target="_blank"
									>
										{jurisdictionInfo.patriarchate.name}
									</a>
								</span>
							</div>
						</FooterSection>
						<FooterSection
							model={newReadonlyModel({ title: t("clergy") })}
						>
							<div className="flex flex-col gap-2">
								{[
									...clergy.map(cleric => (
										<span key={cleric.name}>
											{cleric.link ? (
												<a
													className="hover:underline"
													href={cleric.link}
													target="_blank"
												>
													{cleric.name}
												</a>
											) : (
												cleric.name
											)}
										</span>
									)),
								]}
							</div>
						</FooterSection>
						<FooterSection
							model={newReadonlyModel({ title: t("contact") })}
						>
							<div className="grid grid-cols-2 gap-2">
								{[
									...contacts.map(contact => (
										<Fragment key={contact.phone}>
											<span>{contact.name}</span>
											<span>
												<a
													className="min-w-fit hover:underline"
													href={`tel:${contact.phone}`}
												>
													{formatPhoneNumber(
														contact.phone,
													)}
												</a>
											</span>
										</Fragment>
									)),
								]}
							</div>
						</FooterSection>
					</div>
				</div>
				<hr className="mt-4 text-gray-300 md:hidden" />
				<div className="flex flex-wrap-reverse items-center justify-between gap-x-20 gap-y-5 md:mt-6">
					<span className="copyright w-fit text-sm">
						<span className={georgia.className}>&copy;</span>{" "}
						{copyrightText}
					</span>
					<div className="bottom-links flex flex-wrap gap-2 text-xs text-gray-400">
						{[
							...bottomLinks.map((bottomLink, index) => (
								<Fragment key={bottomLink.link}>
									<span>
										{bottomLink.precedingText &&
											`${bottomLink.precedingText} `}
										<Link
											className="underline hover:text-[#dcb042] active:text-[#dcb042]"
											href={bottomLink.link}
										>
											{bottomLink.linkLabel}
										</Link>
									</span>
									{index != bottomLinks.length - 1 && "|"}
								</Fragment>
							)),
						]}
					</div>
				</div>
				<span className="text-sm">
					{t.rich("siteAttribution", {
						name: "Grod56",
						link: name => (
							<Link
								href="https://github.com/Grod56"
								className="text-[#dcb042] underline"
								target="_blank"
							>
								{name}
							</Link>
						),
					})}
				</span>
			</div>
		</footer>
	);
} satisfies ModeledVoidComponent<FooterModel>;

export default Footer;
