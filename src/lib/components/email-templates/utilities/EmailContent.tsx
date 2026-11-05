import { ReactNode } from "react";
import { Section } from "react-email";

export default function EmailContent({ children }: { children: ReactNode }) {
	return (
		<Section
			style={{
				border: "solid #991B1B",
				borderWidth: "15px 0 0 0",
				padding: "32px",
				paddingTop: "36px",
				paddingBottom: "36px",
			}}
			className={"email-content"}
		>
			{children}
		</Section>
	);
}
