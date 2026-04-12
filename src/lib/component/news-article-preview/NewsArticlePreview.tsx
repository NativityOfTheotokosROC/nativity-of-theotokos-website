"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { NewsArticlePreviewModel } from "../../model/news-article-preview";
import { georgia } from "../../third-party/fonts";
import { getNewsArticleDateString } from "../../utility/date-time";
import { Link } from "../page-loading-bar/PageLoadingBar";
import { ViewTransition } from "react";

const NewsArticlePreview = function ({ model }) {
	const { articlePreview: article, isFeatured } = model.modelView;
	const { title, author, dateCreated, snippet, articleImage, uri } = article;
	const { placeholder, source } = articleImage;
	const articleLink = `/news/${uri}`;
	const dateString = getNewsArticleDateString(dateCreated);
	const tCaptions = useTranslations("imageCaptions");

	return isFeatured ? (
		<Link className="featured-card contents" href={articleLink}>
			<div className="flex flex-col overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3] transition duration-150 ease-out select-none hover:scale-[1.03] hover:cursor-pointer hover:border-[#dcb042] active:scale-[1.03] active:border-[#dcb042] hover:[&_.title]:underline active:[&_.title]:underline">
				<div className="flex h-[16em] w-full items-stretch justify-stretch lg:h-[18em]">
					<ViewTransition name={`article-image-${article.uri}`}>
						<Image
							className="h-full w-full max-w-full grow object-cover object-top"
							height={538}
							width={538}
							alt={tCaptions("featuredArticleImage")}
							src={source}
							placeholder="blur"
							blurDataURL={placeholder}
						/>
					</ViewTransition>
				</div>
				<div className="card-details flex flex-col gap-2.5 p-4">
					<span
						className={`title mb-1 text-2xl md:font-semibold ${georgia.className}`}
					>
						{title}
					</span>
					<span className="timestamp text-base text-gray-600">
						{author} — {dateString}
					</span>
					<p className="line-clamp-4 text-base md:line-clamp-5">
						{snippet}
					</p>
				</div>
			</div>
		</Link>
	) : (
		<Link className="normal-card contents" href={articleLink}>
			<div className="flex max-w-[27em] flex-row items-center gap-4 select-none hover:cursor-pointer md:gap-0 lg:bg-transparent lg:text-black hover:[&_.title]:underline active:[&_.title]:underline">
				<div className="flex h-[6em] max-h-[6em] w-[7em] min-w-[7em] items-stretch justify-stretch overflow-clip rounded-lg md:h-[6.4em] md:max-h-[6.4em] md:w-[8em] md:min-w-[8em]">
					<Image
						className="h-full w-full grow object-cover object-center"
						height={128}
						width={128}
						alt={tCaptions("newsArticleImage")}
						src={source}
						placeholder="blur"
						blurDataURL={placeholder}
					/>
				</div>
				<div className="card-details flex flex-col gap-1.5 py-4 md:px-6">
					<span className="title text-sm lg:text-base">{title}</span>
					<span className="byline text-xs text-gray-600 lg:text-sm">
						{author} — {dateString}
					</span>
				</div>
			</div>
		</Link>
	);
} as ModeledVoidComponent<NewsArticlePreviewModel>;

export default NewsArticlePreview;
