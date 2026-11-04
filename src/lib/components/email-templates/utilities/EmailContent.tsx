import { ReactNode } from "react";
import { Container } from "react-email";
import { twMerge } from "tailwind-merge";

export default function EmailContent({ children }: { children: ReactNode }) {
	return (
		<Container
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
		</Container>
	);
}
