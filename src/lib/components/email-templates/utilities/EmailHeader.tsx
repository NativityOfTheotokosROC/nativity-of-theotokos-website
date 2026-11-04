import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Language } from "../../../utilities/types";
import { georgia } from "../../../third-party/fonts";
import { Container, Img, Link, Text } from "react-email";
import { BASE_URL } from "@/src/lib/utilities/server-constants";

const EmailHeader = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({ namespace: "header", locale: language });

	return (
		<Container
			style={{
				display: "flex",
				flexDirection: "column",
				height: "fit-content",
				width: "100%",
				maxWidth: "100%",
				background: "#111827",
			}}
			className={`email-header`}
		>
			<Container
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					padding: "16px",
				}}
				className="header-content"
			>
				<Link className="contents" href="/">
					<Container
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: "12px",
							width: "fit-content",
						}}
						className="logo"
					>
						<Container style={{ width: "48px", height: "48px" }}>
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
						<Container
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "1px",
							}}
							className={`logo-text ${georgia.className}`}
						>
							<Text
								style={{
									fontSize: "18px",
									lineHeight: "24.75px",
								}}
							>
								{t("logoTop")}
							</Text>
							<Text style={{ fontSize: "14px" }}>
								{t("logoBottom")}
							</Text>
						</Container>
					</Container>
				</Link>
			</Container>
		</Container>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default EmailHeader;
