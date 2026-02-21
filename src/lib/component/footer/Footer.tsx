"use client";

import LogoIcon from "@/public/ui/logo-icon.svg";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { georgia } from "../../third-party/fonts";
import SocialLink from "../social-link/SocialLink";
import FooterSection from "./FooterSection";
import { ModeledVoidComponent } from "@mvc-react/components";
import { FooterModel } from "../../model/footer";
import { Fragment } from "react/jsx-runtime";
import { formatPhoneNumber } from "../../utility/miscellaneous";

const Footer = function ({ model }) {
	const {
		description,
		parishEmail,
		jurisdictionInfo,
		clergy,
		contacts,
		socials,
		copyrightText,
		licenses,
	} = model.modelView;
	const t = useTranslations("footer");

	return (
		<footer id="footer" className="w-full max-w-full">
			<div className="footer-content flex flex-col p-9 gap-4 bg-[#0a0a0a] text-white text-sm">
				<div className="footer-sections flex flex-col gap-x-14 gap-y-8 md:flex-row">
					<div className="flex flex-col gap-6 md:flex-row">
						<LogoIcon
							className="md:self-center size-17.5 min-w-17.5"
							viewBox="0 0 430 430"
						/>
						<FooterSection
							model={newReadonlyModel({
								title: t("heading"),
							})}
						>
							<p>{description}</p>
							<br />
							<span>
								{`${t("email")}: `}
								<Link
									className="hover:underline"
									href={`mailto:${parishEmail}`}
								>
									{parishEmail}
								</Link>
							</span>
						</FooterSection>
					</div>
					<div className="flex flex-col justify-between gap-x-16 gap-y-8 md:flex-row md:flex-wrap">
						<FooterSection
							model={newReadonlyModel({
								title: t("jurisdictional"),
							})}
						>
							<div className="flex flex-col gap-2">
								<span>
									<Link
										className="hover:underline"
										href={jurisdictionInfo.diocese.link}
										target="_blank"
									>
										{jurisdictionInfo.diocese.name}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={jurisdictionInfo.metropolis.link}
										target="_blank"
									>
										{jurisdictionInfo.metropolis.name}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={jurisdictionInfo.patriarch.link}
										target="_blank"
									>
										{jurisdictionInfo.patriarch.name}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={
											jurisdictionInfo.patriarchate.link
										}
										target="_blank"
									>
										{jurisdictionInfo.patriarchate.name}
									</Link>
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
												<Link
													className="hover:underline"
													href={cleric.link}
													target="_blank"
												>
													{cleric.name}
												</Link>
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
							<div className="grid grid-cols-2 gap-x-2">
								{[
									...contacts.map(contact => (
										<Fragment key={contact.phone}>
											<span>{contact.name}</span>
											<span>
												<Link
													className="hover:underline"
													href={`tel:${contact.phone}`}
												>
													{formatPhoneNumber(
														contact.phone,
													)}
												</Link>
											</span>
										</Fragment>
									)),
								]}
							</div>
						</FooterSection>
					</div>
				</div>
				<hr className="text-gray-400 mt-4 md:w-4/10" />
				<div className="social-links text-lg flex gap-3 **:size-4 **:hover:text-[#DCB042]">
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
				<div className="licenses flex flex-wrap gap-2 text-gray-400 text-xs">
					{[
						...licenses.map((license, index) => (
							<Fragment key={license.link}>
								<span>
									{`${license.precedingText} `}
									<Link
										className="underline hover:text-[#dcb042]"
										href={license.link}
										target="_blank"
									>
										{license.linkLabel}
									</Link>
								</span>
								{index != licenses.length - 1 && "|"}
							</Fragment>
						)),
					]}
				</div>
			</div>
		</footer>
	);
} satisfies ModeledVoidComponent<FooterModel>;

export default Footer;
