import { ReactNode } from "react";
import { Container } from "react-email";
import { twMerge } from "tailwind-merge";

export default function EmailContent({ children }: { children: ReactNode }) {
	return (
		<Container
			style={{
				display: "flex",
				flexDirection: "column",
				border: "solid #991B1B",
				borderWidth: "15px 0 0 0",
				padding: "32px",
				paddingBlock: "36px",
			}}
			className={twMerge("email-content")}
		>
			{children}
		</Container>
	);
}
