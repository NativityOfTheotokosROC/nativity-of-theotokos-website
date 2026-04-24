import { CommemorationModel } from "@/src/lib/models/commemoration";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ViewTransition } from "react";
import CommemorationBorder from "@/public/assets/border-8.webp";
import { ShareData } from "@/src/lib/types/general";
import { getEncodedShareData } from "@/src/lib/utilities/miscellaneous";
import ShareButton from "@/src/lib/components/share-button/ShareButton";
import SocialLink from "@/src/lib/components/social-link/SocialLink";
import { newReadonlyModel } from "@mvc-react/mvc";
import Image from "next/image";
import Link from "next/link";
import PrintButton from "@/src/lib/components/print-button/PrintButton";

const Commemoration = function ({ model }) {
	const { commemoration, permalink } = model.modelView;
	const { title, feastDays, body, icon, id } = commemoration;
	const shareData = {
		title,
		url: permalink,
	} satisfies ShareData;
	const encodedShareData = getEncodedShareData(shareData);

	return (
		<main className="commemoration bg-[#FEF8F3] text-black">
			<div
				style={{ backgroundImage: `url(${CommemorationBorder.src})` }}
				className="h-3.75 w-full bg-[#250203] bg-size-[25%] bg-position-[50%_50%] bg-repeat-x md:bg-size-[15%] lg:bg-size-[15%]"
			/>
			<div className="commemoration-content flex min-h-[94svh] flex-col gap-6 p-8 md:items-center md:p-12">
				<div className="metadata flex flex-col gap-6 md:justify-center md:gap-x-8 lg:max-w-full">
					<div className="headline flex flex-col gap-6 md:w-3/4 md:justify-center md:text-center">
						<ViewTransition
							name={`commemoration-title-${id}`}
							share="auto"
						>
							<span
								className={`title text-4xl/tight md:text-5xl/tight lg:text-6xl/tight ${georgia.className} font-semibold wrap-break-word hyphens-auto md:wrap-normal`}
							>
								{title}
							</span>
						</ViewTransition>
						<span className="text-lg">{feastDays}</span>
					</div>
					{icon && (
						<div className="flex w-full flex-col items-center justify-center gap-3 md:w-1/2 md:grow md:self-stretch">
							<div className="flex h-91 w-60 min-w-60 items-stretch justify-stretch overflow-clip rounded-lg">
								<Link
									className="contents"
									href={icon.source}
									target="_blank"
								>
									<Image
										className="grow cursor-pointer object-cover object-center"
										height={364}
										width={240}
										alt={icon.about ?? "Icon of the day"}
										title={icon.about}
										src={icon.source}
										placeholder={
											icon.placeholder
												? "blur"
												: undefined
										}
										blurDataURL={
											icon.placeholder ?? undefined
										}
									/>
								</Link>
							</div>
							{icon.about && (
								<span
									className={`text-center text-xs/relaxed uppercase md:max-w-63`}
								>
									{icon.about}
								</span>
							)}
						</div>
					)}
				</div>
				<div className="flex items-end gap-5 self-center text-sm text-gray-900 **:hover:text-[#dcb042] md:mt-4 md:self-start">
					<ShareButton
						model={newReadonlyModel({
							shareData,
							alternateVariant: true,
						})}
					/>
					<SocialLink
						model={newReadonlyModel({
							details: {
								type: "WhatsApp",
								link: `https://wa.me/?text=${encodedShareData.title}%20${encodedShareData.url}`,
							},
						})}
					/>
					<SocialLink
						model={newReadonlyModel({
							details: {
								type: "Telegram",
								link: `https://t.me/share/url?url=${encodedShareData.url}&text=${encodedShareData.title}`,
							},
						})}
					/>
					<SocialLink
						model={newReadonlyModel({
							details: {
								type: "Facebook",
								link: `https://facebook.com/sharer/sharer.php?u=${encodedShareData.url}&text=${encodedShareData.title}`,
							},
						})}
					/>
					<PrintButton />
				</div>
				<hr className="w-full self-center text-black/50 md:w-3/4" />
				<p
					className={`body self-center text-lg/relaxed md:w-55/100 md:min-w-lg md:text-justify md:text-xl/relaxed [&_.caption]:mx-auto [&_.caption]:text-center [&_.caption]:text-xs/relaxed [&_.caption]:uppercase md:[&_.caption]:max-w-63 [&_img]:mx-auto`}
					dangerouslySetInnerHTML={{ __html: body }}
				/>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<CommemorationModel>;

export default Commemoration;
