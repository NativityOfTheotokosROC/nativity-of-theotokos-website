import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Language } from "../../../utilities/types";
import { georgia } from "../../../third-party/fonts";
import { Column, Container, Img, Link, Row, Section, Text } from "react-email";
import { BASE_URL } from "@/src/lib/utilities/server-constants";

const EmailHeader = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({ namespace: "header", locale: language });

	return (
		<Section
			style={{
				display: "flex",
				justifyContent: "flex-start",
				padding: "16px",
				paddingLeft: "20px",
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
							height: "56px",
						}}
						className="logo-icon"
						alt="Logo Icon"
						src={`${BASE_URL}/assets/full-logo.png`}
						height={56}
					/>
				</Section>
			</Link>
		</Section>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default EmailHeader;
