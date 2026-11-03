import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { googleSans, googleSansFlex } from "../../../third-party/fonts";

export default function EmailContent({ children }: { children: ReactNode }) {
	console.log("rendering email content");
	return (
		<main
			className={twMerge(
				"email-content flex-col gap-6 border-t-15 border-t-red-800 bg-[#FEF8F3] p-8 py-9 text-black md:py-10 lg:px-20 dark:bg-[#222222] dark:text-white",
				`${googleSans.className} ${googleSansFlex.className}`,
			)}
		>
			{children}
		</main>
	);
}
