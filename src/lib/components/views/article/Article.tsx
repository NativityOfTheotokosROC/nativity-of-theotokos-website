"use client";

import ShareButton from "@/src/lib/components/share-button/ShareButton";
import SocialLink from "@/src/lib/components/social-link/SocialLink";
import { ArticleModel } from "@/src/lib/models/article";
import "@/src/lib/styles/document.css";
import { georgia } from "@/src/lib/third-party/fonts";
import { getNewsArticleDateString } from "@/src/lib/utilities/date-time";
import { getEncodedShareData } from "@/src/lib/utilities/miscellaneous";
import { useUserInformation } from "@/src/lib/utilities/user";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import ArticleInteractiveLink from "../../article-interactive-link/ArticleInteractiveLink";
import { EditIcon } from "lucide-react";
import { usePathname } from "@/src/i18n/navigation";

const Article = function ({ model }) {
	const { article, permalink, options } = model.modelView;
	const { title, author, articleImage, dateCreated, dateUpdated, body, uri } =
		article;
	const { source, about, placeholder } = articleImage;
	const t = useTranslations("news");
	const tCaptions = useTranslations("imageCaptions");
	const shareData = {
		title,
		url: permalink,
	};
	const encodedShareData = getEncodedShareData(shareData);
	const userInformation = useUserInformation();
	const canEdit =
		!options?.editingDisabled &&
		(author.email && userInformation !== "pending"
			? userInformation?.email === author.email
			: false ||
				(userInformation !== "pending" &&
					userInformation?.roles.includes("admin")));
	const path = usePathname();

	return (
		<main className="article bg-[#FEF8F3] text-black">
			<div className="article-content flex flex-col gap-6 border-t-15 border-[#250203]/80 p-8 md:p-12">
				<div className="metadata flex flex-col gap-6 md:flex-row md:gap-x-8 lg:max-w-full">
					<div className="headline flex flex-col gap-6 md:w-1/2">
						<ViewTransition
							name={`article-title-${uri}`}
							share="auto"
						>
							<span
								className={`title text-4xl/tight md:text-5xl/tight lg:text-6xl/tight ${georgia.className} font-semibold`}
							>
								{title}
							</span>
						</ViewTransition>
						<div className="byline flex flex-col gap-1">
							<div className="md:max-[50vw] -ml-8 flex w-fit max-w-[80vw] min-w-3/4 items-center gap-2 bg-gray-900/80 p-2 pr-4 pl-8 text-white md:-ml-12 md:pl-12">
								<span className="author text-base md:text-xl">{`${t("byline")} ${author.name}`}</span>
							</div>
							<span className="date text-lg">
								{`${getNewsArticleDateString(dateCreated)}${
									dateUpdated
										? ` (${t("articleUpdated")}: ${getNewsArticleDateString(dateUpdated)})`
										: ""
								}`}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-col gap-3 md:w-1/2 md:grow md:self-stretch">
						<div className="flex h-[15em] w-full items-stretch justify-stretch overflow-clip rounded-lg md:h-fit md:max-h-[25em]">
							<Link
								className="contents"
								href={source}
								target="_blank"
							>
								<ViewTransition
									name={`article-image-${article.uri}`}
									share="auto"
								>
									<Image
										className="grow cursor-pointer object-cover object-center"
										height={600}
										width={600}
										alt={tCaptions("newsArticleImage")}
										title={about}
										src={source}
										placeholder={
											placeholder ? "blur" : undefined
										}
										blurDataURL={placeholder}
									/>
								</ViewTransition>
							</Link>
						</div>
						{about && (
							<span className={`text-xs/relaxed uppercase`}>
								{about}
							</span>
						)}
					</div>
				</div>
				<div className="flex items-end gap-5 self-end text-sm text-gray-900 **:hover:text-[#dcb042] md:mt-4">
					{!options?.sharingDisabled && (
						<>
							<ShareButton
								model={newReadonlyModel({
									shareData: encodedShareData,
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
						</>
					)}
					{canEdit && (
						<ArticleInteractiveLink
							model={newReadonlyModel({
								title: t("editArticle"),
								link: `${path}/edit`,
							})}
						>
							<EditIcon strokeWidth={1.5} />
						</ArticleInteractiveLink>
					)}
				</div>
				<hr className="w-full self-center text-black/50 md:w-3/4" />
				<div
					className={`body document self-center text-lg/relaxed md:w-55/100 md:min-w-lg md:text-xl/relaxed`}
					dangerouslySetInnerHTML={{ __html: body }}
				/>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<ArticleModel>;

export default Article;
