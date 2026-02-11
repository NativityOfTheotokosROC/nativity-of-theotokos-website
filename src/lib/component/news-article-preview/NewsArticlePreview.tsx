"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { NewsArticlePreviewModel } from "../../model/news-article-preview";
import Image from "next/image";
import { georgia } from "../../third-party/fonts";
import { toZonedTime } from "date-fns-tz";
import { useRouter } from "@/src/i18n/navigation";
import { useLoadingBarRouter } from "../loading-bar/navigation";

const NewsArticlePreview = function ({ model }) {
	const { articlePreview: article, isFeatured } = model.modelView;
	const { title, author, dateCreated, snippet, articleImage } = article;
	const { placeholder, source, about } = articleImage;
	const router = useLoadingBarRouter(useRouter);
	const dateLocale = "ru-RU";
	const dateString = toZonedTime(dateCreated, "CAT").toLocaleDateString(
		dateLocale,
		{
			dateStyle: "short",
		},
	);

	return isFeatured ? (
		<div
			className="featured-card flex flex-col select-none hover:cursor-pointer bg-[#FEF8F3] border border-gray-900/20 rounded-lg overflow-clip hover:border-[#dcb042] hover:[&_.title]:underline hover:scale-[1.03] active:border-[#dcb042] active:[&_.title]:underline active:scale-[1.03] transition ease-out duration-150"
			onClick={() => {
				router.push("/news");
				router.refresh();
			}}
		>
			<div className="flex justify-stretch items-stretch w-full h-[15em] max-h-[80dvh]">
				<Image
					className="grow object-cover object-center"
					height={538}
					width={538}
					alt={about ?? "News article image"}
					src={source}
					placeholder="blur"
					blurDataURL={placeholder}
				/>
			</div>
			<div className="card-details p-4 flex flex-col gap-1.5">
				<span className={`title text-xl mb-1 ${georgia.className}`}>
					{title}
				</span>
				<span className="timestamp text-sm text-gray-600">
					{author} — {dateString}
				</span>
				<p className="text-base line-clamp-6">{snippet}</p>
			</div>
		</div>
	) : (
		<div
			className="normal-card flex flex-row items-center max-w-[27em] gap-4 md:gap-0 lg:bg-transparent lg:text-black hover:cursor-pointer hover:[&_.title]:underline active:[&_.title]:underline select-none"
			onClick={() => {
				router.push("/news");
				router.refresh();
			}}
		>
			<div className="flex justify-stretch items-stretch w-[7em] min-w-[7em] h-[6em] max-h-[6em] md:w-[8em] md:min-w-[8em] md:h-[6.4em] md:max-h-[6.4em] rounded-lg overflow-clip">
				<Image
					className="grow object-cover object-center"
					height={128}
					width={128}
					alt={about ?? "News article image"}
					src={source}
					placeholder="blur"
					blurDataURL={placeholder}
				/>
			</div>
			<div className="card-details py-4 md:px-6 flex flex-col gap-1.5">
				<span className="title text-sm md:text-base">{title}</span>
				<span className="byline text-xs md:text-sm text-gray-600">
					{author} — {dateString}
				</span>
				<p className="line-clamp-2 hidden">{snippet}</p>
			</div>
		</div>
	);
} as ModeledVoidComponent<NewsArticlePreviewModel>;

export default NewsArticlePreview;
