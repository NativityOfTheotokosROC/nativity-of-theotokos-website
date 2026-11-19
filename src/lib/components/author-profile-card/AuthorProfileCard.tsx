import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { AuthorProfileCardModel } from "../../models/author-profile-card";
import Image from "next/image";
import { georgia } from "../../third-party/fonts";
import { AtSignIcon } from "lucide-react";
import Link from "next/link";

const AuthorProfileCard = function ({ model }) {
	const {
		modelView: { name, description, profilePicture, contactEmail },
	} = model;

	return (
		<div className="flex w-2xl max-w-full flex-col gap-6 overflow-clip rounded-lg bg-gray-900 text-white not-only:p-6">
			{profilePicture && (
				<Image
					src={profilePicture.source}
					alt={name}
					className="h-30 w-30 object-cover object-center brightness-120 grayscale"
					width={120}
					height={120}
					blurDataURL={profilePicture.placeholder}
					placeholder="blur"
				/>
			)}
			<span className={`text-xl font-semibold ${georgia.className}`}>
				{name}
			</span>
			<p>{description}</p>
			{contactEmail && (
				<span className="inline-flex gap-3 text-sm wrap-break-word hyphens-auto">
					<AtSignIcon />
					<Link href={`mailto:${contactEmail}`} className="underline">
						{contactEmail}
					</Link>
				</span>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<AuthorProfileCardModel>>;

export default AuthorProfileCard;
