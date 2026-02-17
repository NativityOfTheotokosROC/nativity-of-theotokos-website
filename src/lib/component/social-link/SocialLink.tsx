import Link from "next/link";
import {
	SiWhatsapp as WhatsApp,
	SiInstagram as Instagram,
	SiYoutube as Youtube,
	SiFacebook as Facebook,
	SiGithub as Github,
	SiX as X,
	SiTelegram as Telegram,
} from "@icons-pack/react-simple-icons";
import { Mail as Email, Globe as Other } from "lucide-react";
import { newReadonlyModel } from "@mvc-react/mvc";
import {
	ConditionalComponent,
	ModeledVoidComponent,
} from "@mvc-react/components";
import { JSX } from "react";
import { SocialLinkModel } from "../../model/social-link";

const SocialLink = function ({ model }) {
	const { details } = model.modelView;

	return (
		<Link href={details.link} title={details.type} target="_blank">
			<ConditionalComponent
				model={newReadonlyModel({
					condition: details.type,
					components: new Map<typeof details.type, () => JSX.Element>(
						[
							["Facebook", () => <Facebook />],
							["Email", () => <Email />],
							["GitHub", () => <Github />],
							["Instagram", () => <Instagram />],
							["WhatsApp", () => <WhatsApp />],
							["Telegram", () => <Telegram />],
							["X", () => <X />],
							["YouTube", () => <Youtube />],
						],
					),
					FallbackComponent: () => <Other />,
				})}
			/>
		</Link>
	);
} as ModeledVoidComponent<SocialLinkModel>;

export default SocialLink;
