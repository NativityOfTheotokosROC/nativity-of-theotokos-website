"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

const PrintButton = function () {
	const tNonDescriptive = useTranslations("nonDescriptive");

	return (
		<>
			<button
				title={tNonDescriptive("saveAsPDF")}
				className="flex items-end gap-3"
				onClick={() => {
					window.print();
				}}
			>
				<Download strokeWidth={1.5} />
			</button>
		</>
	);
};

export default PrintButton;
