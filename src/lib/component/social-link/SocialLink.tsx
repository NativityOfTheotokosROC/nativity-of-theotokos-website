import Link from "next/link";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
	faWhatsapp as WhatsApp,
	faInstagram as Instagram,
	faYoutube as Youtube,
	faFacebook as Facebook,
	faGithub as Github,
	faXTwitter as X,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope as Email } from "@fortawesome/free-regular-svg-icons";
import { faEarthAmericas as Other } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
		<Link
			className={`hover:text-amber-400`}
			href={details.link}
			title={details.type}
			target="_blank"
		>
			<ConditionalComponent
				model={newReadonlyModel({
					condition: details.type,
					components: new Map<typeof details.type, () => JSX.Element>(
						[
							[
								"Facebook",
								() => <FontAwesomeIcon icon={Facebook} />,
							],
							["Email", () => <FontAwesomeIcon icon={Email} />],
							["GitHub", () => <FontAwesomeIcon icon={Github} />],
							[
								"Instagram",
								() => <FontAwesomeIcon icon={Instagram} />,
							],
							[
								"WhatsApp",
								() => <FontAwesomeIcon icon={WhatsApp} />,
							],
							["X", () => <FontAwesomeIcon icon={X} />],
							[
								"YouTube",
								() => <FontAwesomeIcon icon={Youtube} />,
							],
						]
					),
					FallbackComponent: () => <FontAwesomeIcon icon={Other} />,
				})}
			/>
		</Link>
	);
} as ModeledVoidComponent<SocialLinkModel>;

export default SocialLink;
