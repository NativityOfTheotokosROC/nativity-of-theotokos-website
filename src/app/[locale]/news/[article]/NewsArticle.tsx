"use client";
import { NewsArticleModel } from "@/src/lib/model/news-article";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { toZonedTime } from "date-fns-tz";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

const NewsArticle = function ({ model }) {
	const { title, author, articleImage, dateCreated, dateUpdated, body } =
		model.modelView.article;
	const { source, about, placeholder } = articleImage;
	const locale = useLocale();
	const dateLocale = locale == "ru" ? "ru-RU" : "en-uk";
	const t = useTranslations("news");
	const tCaptions = useTranslations("imageCaptions");

	return (
		<main className="newsarticle bg-[#FEF8F3] text-black">
			<div className="newsarticle-content flex flex-col p-8 md:p-12 gap-6 border-t-15 border-[#250203]/80">
				<div className="metadata flex flex-col gap-6 md:flex-row md:gap-x-8 lg:max-w-full">
					<div className="headline flex flex-col gap-6 md:w-1/2">
						<span
							className={`title text-4xl/tight md:text-5xl/tight lg:text-6xl/tight ${georgia.className} font-semibold`}
						>
							{title}
						</span>
						<div className="byline flex flex-col gap-1">
							<div className="flex items-center gap-2 -ml-8 pl-8 md:-ml-12 md:pl-12 pr-3 text-white bg-gray-900/80 w-3/4 p-2">
								<span className="author text-base md:text-xl">{`${t("author")} ${author}`}</span>
							</div>
							<span className="date text-lg">
								{`${toZonedTime(
									dateCreated,
									"CAT",
								).toLocaleDateString(dateLocale, {
									dateStyle: "short",
								})}${
									dateUpdated
										? ` (${t("articleUpdated")}: ${toZonedTime(
												dateUpdated,
												"CAT",
											).toLocaleDateString(dateLocale, {
												dateStyle: "short",
											})})`
										: ""
								}`}
							</span>
						</div>
					</div>
					<div className="flex justify-stretch items-stretch w-full h-[15em] rounded-lg overflow-clip md:w-1/2 md:h-fit md:grow md:self-stretch md:max-h-[25em]">
						<Image
							className="grow object-cover object-center"
							height={600}
							width={600}
							alt={about ?? tCaptions("newsArticleImage")}
							title={about}
							src={source}
							placeholder="blur"
							blurDataURL={placeholder}
						/>
					</div>
				</div>
				<hr className="text-black/50 mt-6 mb-3 w-full self-center md:w-3/4" />
				<p
					className={`body text-lg/relaxed md:w-55/100 md:min-w-lg self-center md:text-xl/relaxed`}
					dangerouslySetInnerHTML={{ __html: body }}
				/>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<NewsArticleModel>;

export default NewsArticle;
