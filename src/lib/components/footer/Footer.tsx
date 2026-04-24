"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { Fragment } from "react/jsx-runtime";
import { FooterModel } from "../../models/footer";
import { georgia } from "../../third-party/fonts";
import { formatPhoneNumber, isRemotePath } from "../../utilities/miscellaneous";
import LogoIcon from "@/public/assets/logo-icon.svg";
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
						<LogoIcon className="logo-icon size-17.5 min-w-17.5 md:self-center" />
						<FooterSection
							model={newReadonlyModel({
								title: t("heading"),
							})}
						>
							<p>{description}</p>
							<br />
							<span>
								{`${t("email")}: `}
								<a
									className="hover:underline"
									href={`mailto:${parishEmail}`}
								>
									{parishEmail}
								</a>
							</span>
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
				<hr className="mt-4 text-gray-400 md:w-4/10" />
				<div className="social-links flex gap-3 text-lg **:size-4 **:hover:text-[#DCB042]">
					{[
						...socials.map(social => (
							<SocialLink
								key={social.modelView.details.link}
								model={social}
							/>
						)),
					]}
				</div>
				<span className="copyright text-xs">
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
										className="underline hover:text-[#dcb042]"
										href={bottomLink.link}
										target={
											isRemotePath(bottomLink.link)
												? "_blank"
												: undefined
										}
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
		</footer>
	);
} satisfies ModeledVoidComponent<FooterModel>;

export default Footer;
