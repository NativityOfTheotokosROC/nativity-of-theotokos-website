"use client";

import LogoIcon from "@/public/ui/logo-icon.svg";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { georgia } from "../../third-party/fonts";
import SocialLink from "../social-link/SocialLink";
import FooterSection from "./FooterSection";

// TODO: Incorporate model
const Footer = function () {
	const t = useTranslations("footer");
	const tLinks = useTranslations("links");

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
							<p>{t("description")}</p>
							<br />
							<span>
								{`${t("email")}: `}
								<Link
									className="hover:underline"
									href={
										"mailto:nativityoftheotokos@gmail.com"
									}
								>
									nativityoftheotokos@gmail.com
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
										href={tLinks("diocese")}
										target="_blank"
									>
										{t("diocese")}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={tLinks("jurisdiction")}
										target="_blank"
									>
										{t("jurisdiction")}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={tLinks("patriarch")}
										target="_blank"
									>
										{t("patriarch")}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={tLinks("patriarchate")}
										target="_blank"
									>
										{t("patriarchate")}
									</Link>
								</span>
							</div>
						</FooterSection>
						<FooterSection
							model={newReadonlyModel({ title: t("clergy") })}
						>
							<div className="flex flex-col gap-2">
								<span>{t("frDimitri")}</span>
								<span>{t("frSavva")}</span>
							</div>
						</FooterSection>
						<FooterSection
							model={newReadonlyModel({ title: t("contact") })}
						>
							<div className="grid grid-cols-2 gap-x-2">
								<span>{t("phone")}</span>
								<span>
									<Link
										className="hover:underline"
										href="tel:+263716063616"
									>
										+263 716 063 616
									</Link>
								</span>
								<span>{t("larisa")}</span>
								<span>
									<Link
										className="hover:underline"
										href="tel:+263771389444"
									>
										+263 771 389 444
									</Link>
								</span>
								<span>{t("vasily")}</span>
								<span>
									<Link
										className="hover:underline"
										href="tel:+263772473317"
									>
										+263 772 473 317
									</Link>
								</span>
							</div>
						</FooterSection>
					</div>
				</div>
				<hr className="text-gray-400 mt-4 md:w-4/10" />
				<div className="social-links text-lg flex gap-3 **:size-4 **:hover:text-[#DCB042]">
					<SocialLink
						model={newReadonlyModel({
							details: {
								type: "Facebook",
								link: "https://facebook.com/people/Orthodox-Church-in-Zimbabwe-Moscow-Patriarchate/61577719142729",
							},
						})}
					/>
					<SocialLink
						model={newReadonlyModel({
							details: {
								type: "Instagram",
								link: "https://instagram.com/exarchate.mp",
							},
						})}
					/>
					<SocialLink
						model={newReadonlyModel({
							details: {
								type: "WhatsApp",
								link: "https://wa.me/263716063616",
							},
						})}
					/>
				</div>
				<span className="copyright text-xs">
					<span className={georgia.className}>&copy;</span>{" "}
					{t("copyright")}
				</span>
				<div className="licenses flex flex-wrap gap-2 text-gray-400 text-xs">
					<span>
						{`${t("dailyReadingsLicense")} `}
						<Link
							className="underline hover:text-[#dcb042]"
							href={tLinks("holyTrinityChurch")}
							target="_blank"
						>
							Holy Trinity Orthodox Church
						</Link>
					</span>
					|
					<span>
						{`${t("logoIconLicense")} `}
						<Link
							className="underline hover:text-[#dcb042]"
							href="https://lordicon.com/"
							target="_blank"
						>
							Lordicon.com
						</Link>
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
