import Footer from "@/src/lib/component/footer/Footer";
import Header from "@/src/lib/component/header/Header";
import LanguageSwitcher from "@/src/lib/component/language-switcher/LanguageSwitcher";
import PageLoadingBar from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { FooterModel } from "@/src/lib/model/footer";
import { Language, Navlink } from "@/src/lib/type/miscellaneous";
import { ModeledContainerComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Toaster } from "react-hot-toast";

export interface LocaleLayoutModelView {
	locale: Language;
}

export type LocaleLayoutModel = ReadonlyModel<LocaleLayoutModelView>;

const LocaleLayout = async function ({ model, children }) {
	const { locale } = model.modelView;
	const tNavMenu = await getTranslations("navMenu");
	const tFooterVariable = await getTranslations("footer_variable");
	const tLinks = await getTranslations("links");
	const navlinks = [
		{ link: "/", text: tNavMenu("home") },
		{
			link: "/#bulletin",
			text: tNavMenu("parishBulletin"),
			isReplaceable: true,
		},
		{
			link: "/#resources",
			text: tNavMenu("resources"),
			isReplaceable: true,
		},
		{
			link: "/#media",
			text: tNavMenu("media"),
			isReplaceable: true,
		},
		{
			link: "/#footer",
			text: tNavMenu("contact"),
			isReplaceable: true,
		},
	] satisfies Navlink[];
	const footer = newReadonlyModel({
		description: tFooterVariable("description"),
		parishEmail: "info@nativityoftheotokos.com",
		clergy: [
			{ name: tFooterVariable("frDimitri") },
			{ name: tFooterVariable("frSavva") },
		],
		jurisdictionInfo: {
			diocese: {
				name: tFooterVariable("diocese"),
				link: tLinks("diocese"),
			},
			metropolis: {
				name: tFooterVariable("jurisdiction"),
				link: tLinks("jurisdiction"),
			},
			patriarch: {
				name: tFooterVariable("patriarch"),
				link: tLinks("patriarch"),
			},
			patriarchate: {
				name: tFooterVariable("patriarchate"),
				link: tLinks("patriarchate"),
			},
		},
		contacts: [
			{ name: tFooterVariable("phone"), phone: "+263716063616" },
			{ name: tFooterVariable("vasily"), phone: "+263772473317" },
			{ name: tFooterVariable("larisa"), phone: "+263771389444" },
		],
		socials: [
			newReadonlyModel({
				details: {
					type: "Facebook",
					link: "https://facebook.com/people/Orthodox-Church-in-Zimbabwe-Moscow-Patriarchate/61577719142729",
				},
			}),
			newReadonlyModel({
				details: {
					type: "Instagram",
					link: "https://instagram.com/exarchate.mp",
				},
			}),
			newReadonlyModel({
				details: {
					type: "WhatsApp",
					link: "https://wa.me/263716063616",
				},
			}),
		],
		copyrightText: tFooterVariable("copyright"),
		bottomLinks: [
			{
				precedingText: tFooterVariable("dailyReadingsLicense"),
				linkLabel: "Holy Trinity Orthodox",
				link: tLinks("holyTrinityChurch"),
			},
			{
				precedingText: tFooterVariable("logoIconLicense"),
				linkLabel: "Lordicon.com",
				link: "https://lordicon.com",
			},
			{
				linkLabel: tFooterVariable("admin"),
				link: "/admin",
			},
		],
	}) satisfies FooterModel;

	return (
		<>
			<PageLoadingBar />
			<Header model={newReadonlyModel({ navlinks })} />
			{children}
			<Footer model={footer} />
			<LanguageSwitcher model={newReadonlyModel({ locale })} />
			<Toaster position="bottom-center" containerStyle={{ bottom: 25 }} />
		</>
	);
} satisfies ModeledContainerComponent<LocaleLayoutModel>;

export default LocaleLayout;
