import Logo from "@/public/assets/full-logo-light.png";
import { BASE_URL } from "@/src/lib/utilities/server-constants";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Img, Link, Section } from "react-email";
import { Language } from "../../../utilities/types";

const EmailHeader = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({ namespace: "header", locale: language });

	return (
		<Section
			style={{
				display: "flex",
				justifyContent: "flex-start",
				alignItems: "center",
				padding: "24px",
				background: "#111827",
			}}
			className="email-header"
		>
			<Link style={{ display: "contents" }} href={BASE_URL}>
				<Section
					style={{
						width: "fit-content",
					}}
					className="logo"
				>
					<Img
						style={{
							height: "32px",
						}}
						className="logo-icon"
						alt="Logo Icon"
						src={Logo.src}
						height={32}
					/>
				</Section>
			</Link>
		</Section>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default EmailHeader;
