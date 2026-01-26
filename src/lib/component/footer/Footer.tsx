import { ModeledVoidComponent } from "@mvc-react/components";
import { FooterModel } from "../../model/footer";
import Link from "next/link";
import SocialLink from "../social-link/SocialLink";
import { newReadonlyModel } from "@mvc-react/mvc";
import FooterSection from "./FooterSection";
import LogoIcon from "@/public/logo-icon.svg";
import { georgia } from "../../third-party/fonts";

const Footer = function ({ model }) {
	const { copyrightText } = model.modelView;

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
								title: "Nativity of the Theotokos Church",
							})}
						>
							<p>
								Nativity of the Theotokos Parish of the Russian
								Orthodox Church in Zimbabwe. Located at
								Kingsmead Private Chapel, Cnr Rayl Road and
								Kingsmead Road, Borrowdale, Harare.
							</p>
							<br />
							<span>
								Email:{" "}
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
								title: "Jurisdictional",
							})}
						>
							<div className="flex flex-col gap-2">
								<span>
									<Link
										className="hover:underline"
										href={
											"https://exarchate-africa.ru/dioceses_cat/yuzhno-afrikanskaya-eparhiya/"
										}
										target="_blank"
									>
										{"Southern African Diocese"}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={"https://exarchate-africa.ru"}
										target="_blank"
									>
										{"Patriarchal Exarchate of Africa"}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={"https://mospat.ru/en/patriarch"}
										target="_blank"
									>
										{"His Holiness Patriarch Kirill"}
									</Link>
								</span>
								<span>
									<Link
										className="hover:underline"
										href={"https://mospat.ru/en"}
										target="_blank"
									>
										{"Moscow Patriarchate"}
									</Link>
								</span>
							</div>
						</FooterSection>
						<FooterSection
							model={newReadonlyModel({ title: "Clergy" })}
						>
							<div className="flex flex-col gap-2">
								<span>Fr Dimitri Polokhov</span>
								<span>Fr Savva Kajawa</span>
							</div>
						</FooterSection>
						<FooterSection
							model={newReadonlyModel({ title: "Contact" })}
						>
							<div className="grid grid-cols-2 gap-x-2">
								<span>Phone</span>
								<span>
									<Link
										className="hover:underline"
										href="tel:+263716063616"
									>
										+263 716 063 616
									</Link>
								</span>
								<span>Larisa</span>
								<span>
									<Link
										className="hover:underline"
										href="tel:+263780292358"
									>
										+263 780 292 358
									</Link>
								</span>
								<span>Vasily</span>
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
				<div className="social-links text-lg flex gap-2">
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
					{copyrightText}
				</span>
				<div className="licenses flex flex-wrap gap-2 text-gray-400 text-xs">
					<span>
						Daily readings sourced from{" "}
						<Link
							className="underline hover:text-[#dcb042]"
							href="https://holytrinityorthodox.com/"
							target="_blank"
						>
							Holy Trinity Orthodox Church
						</Link>
					</span>
					|
					<span>
						Logo icon by{" "}
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
} as ModeledVoidComponent<FooterModel>;

export default Footer;
