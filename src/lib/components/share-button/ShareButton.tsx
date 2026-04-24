"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { ShareButtonModel } from "../../models/share-button";
import { useTranslations } from "next-intl";
import { Share, Share2 } from "lucide-react";

const ShareButton = function ({ model }) {
	const { shareData, alternateVariant } = model.modelView;
	const { title, url, text } = shareData;
	const tNonDescriptive = useTranslations("nonDescriptive");

	return (
		<>
			{navigator.share && navigator.canShare({ title, url, text }) && (
				<button
					title={tNonDescriptive("share")}
					className="flex items-end gap-3"
					onClick={() => {
						navigator.share({ title, url, text });
					}}
				>
					{alternateVariant ? (
						<Share2 strokeWidth={1.5} />
					) : (
						<Share strokeWidth={1.5} />
					)}
				</button>
			)}
		</>
	);
} satisfies ModeledVoidComponent<ShareButtonModel>;

export default ShareButton;
