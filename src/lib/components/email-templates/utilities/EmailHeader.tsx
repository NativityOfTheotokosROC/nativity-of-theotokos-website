import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Language } from "../../../utilities/types";
import { georgia } from "../../../third-party/fonts";
import { Column, Container, Img, Link, Section, Text } from "react-email";
import { BASE_URL } from "@/src/lib/utilities/server-constants";

const EmailHeader = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({ namespace: "header", locale: language });

	return (
		<Container
			style={{
				padding: "16px",
				height: "fit-content",
				background: "#111827",
			}}
			className="email-header"
		>
			<Link style={{ display: "contents" }} href={BASE_URL}>
				<Container>
					<Section
						style={{
							width: "fit-content",
						}}
						className="logo"
					>
						<Column style={{ paddingRight: "12px" }}>
							<Container
								style={{ width: "48px", height: "48px" }}
							>
								<Img
									style={{
										objectFit: "contain",
										objectPosition: "center",
									}}
									className="logo-icon"
									alt="Logo Icon"
									src={`${BASE_URL}/icon2.png`}
									width={48}
									height={48}
								/>
							</Container>
						</Column>
						<Column>
							<Section
								style={{
									color: "white",
									fontFamily:
										"Georgia, Times New Roman, serif",
								}}
								className={`logo-text ${georgia.className}`}
							>
								<span
									style={{
										fontSize: "18px",
										lineHeight: "24.75px",
										paddingBottom: "1px",
									}}
								>
									{t("logoTop")}
								</span>
								<span style={{ fontSize: "14px" }}>
									{t("logoBottom")}
								</span>
							</Section>
						</Column>
					</Section>
				</Container>
			</Link>
		</Container>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default EmailHeader;
