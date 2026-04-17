"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { ShareButtonModel } from "../../models/share-button";
import { useTranslations } from "next-intl";
import { Share } from "lucide-react";

const ShareButton = function ({ model }) {
	const { title, url } = model.modelView;
	const tNonDescriptive = useTranslations("nonDescriptive");

	return (
		<>
			{navigator.share && navigator.canShare({ title, url }) && (
				<button
					title={tNonDescriptive("share")}
					className="flex items-end gap-3"
					onClick={() => {
						navigator.share({ title, url });
					}}
				>
					<Share strokeWidth={1.5} />
				</button>
			)}
		</>
	);
} satisfies ModeledVoidComponent<ShareButtonModel>;

export default ShareButton;
