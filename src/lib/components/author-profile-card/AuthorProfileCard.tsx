import { StyledModeledComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { AtSignIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { AuthorProfileCardModel } from "../../models/author-profile-card";
import { georgia } from "../../third-party/fonts";
import Ornament from "@/public/assets/ornament_11.svg";

const AuthorProfileCard = function ({ model, className, style }) {
	const {
		modelView: { name, description, profilePicture, contactEmail },
	} = model;

	return (
		<div
			style={style}
			className={twMerge(
				"flex w-full max-w-full flex-col gap-6 overflow-clip rounded-lg bg-gray-900 p-6 text-white md:w-xl",
				className,
			)}
		>
			<Ornament className="h-auto max-h-[4em] w-full self-center fill-[#ffdc4f] md:w-8/10 md:w-auto" />
			{profilePicture && (
				<Image
					src={profilePicture.source}
					alt={name}
					className="h-40 w-40 object-cover object-center brightness-135 grayscale"
					width={160}
					height={160}
					blurDataURL={profilePicture.placeholder}
					placeholder="blur"
				/>
			)}
			<span className={`text-xl font-semibold ${georgia.className}`}>
				{name}
			</span>
			<p className="text-sm">{description}</p>
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
} satisfies StyledModeledComponent<InitializedModel<AuthorProfileCardModel>>;

export default AuthorProfileCard;
