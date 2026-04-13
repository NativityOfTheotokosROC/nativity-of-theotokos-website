"use cache";

import ShareButton from "@/src/lib/component/share-button/ShareButton";
import SocialLink from "@/src/lib/component/social-link/SocialLink";
import { NewsArticleModel } from "@/src/lib/model/news-article";
import { georgia } from "@/src/lib/third-party/fonts";
import { getNewsArticleDateString } from "@/src/lib/utility/date-time";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { locale as rootLocale } from "next/root-params";
import { ViewTransition } from "react";

const NewsArticle = async function ({ model }) {
	const { article, permalink } = model.modelView;
	const { title, author, articleImage, dateCreated, dateUpdated, body } =
		article;
	const { source, about, placeholder } = articleImage;
	const locale = await rootLocale();
	const t = await getTranslations({ locale, namespace: "news" });
	const tCaptions = await getTranslations({
		locale,
		namespace: "imageCaptions",
	});
	const shareData = {
		title,
		url: permalink,
	};
	const encodedShareData: typeof shareData = {
		title: encodeURI(shareData.title),
		url: encodeURI(shareData.url),
	};

	return (
		<main className="newsarticle bg-[#FEF8F3] text-black">
			<div className="newsarticle-content flex flex-col gap-6 border-t-15 border-[#250203]/80 p-8 md:p-12">
				<div className="metadata flex flex-col gap-6 md:flex-row md:gap-x-8 lg:max-w-full">
					<div className="headline flex flex-col gap-6 md:w-1/2">
						<span
							className={`title text-4xl/tight md:text-5xl/tight lg:text-6xl/tight ${georgia.className} font-semibold`}
						>
							<ViewTransition
								name={`article-title-${article.uri}`}
								share="auto"
							>
								{title}
							</ViewTransition>
						</span>
						<div className="byline flex flex-col gap-1">
							<div className="md:max-[50vw] -ml-8 flex w-fit max-w-[80vw] min-w-3/4 items-center gap-2 bg-gray-900/80 p-2 pr-4 pl-8 text-white md:-ml-12 md:pl-12">
								<span className="author text-base md:text-xl">{`${t("author")} ${author}`}</span>
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
										alt={
											about ??
											tCaptions("newsArticleImage")
										}
										title={about}
										src={source}
										placeholder="blur"
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
					<ShareButton
						model={newReadonlyModel({
							title: shareData.title,
							url: shareData.url,
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
				</div>
				<hr className="w-full self-center text-black/50 md:w-3/4" />
				<p
					className={`body self-center text-lg/relaxed md:w-55/100 md:min-w-lg md:text-xl/relaxed`}
					dangerouslySetInnerHTML={{ __html: body }}
				/>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<NewsArticleModel>;

export default NewsArticle;
