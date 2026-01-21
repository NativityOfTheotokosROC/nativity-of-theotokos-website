import { ModeledVoidComponent } from "@mvc-react/components";
import { NewsArticlePreviewModel } from "../../model/news-article-preview";
import Image from "next/image";
import { georgia } from "../../third-party/fonts";

const NewsArticlePreview = function ({ model }) {
	const { articlePreview: article, isFeatured } = model.modelView;
	const { title, author, dateCreated, snippet, articleImage } = article;
	const { placeholder, source, about } = articleImage;
	const dateString = dateCreated.toLocaleDateString("en-uk", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});

	return isFeatured ? (
		<div
			className="featured-card flex flex-col hover:cursor-pointer bg-[#FEF8F3] border border-gray-900/20 rounded-lg overflow-clip"
			onClick={() => alert("Content to be added soon!")}
		>
			<div className="flex justify-stretch items-stretch w-full h-[15em] max-h-[75dvh]">
				<Image
					className="grow object-cover object-center"
					height={500}
					width={500}
					alt={about ?? "News article image"}
					title={about}
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
					{author} | {dateString}
				</span>
				<p className="text-base line-clamp-6">{snippet}</p>
			</div>
		</div>
	) : (
		<div
			className="normal-card flex flex-row items-center gap-4 md:gap-0 lg:bg-transparent lg:text-black hover:cursor-pointer"
			onClick={() => alert("Content to be added soon!")}
		>
			<div className="flex justify-stretch items-stretch w-[7em] min-w-[7em] h-[6em] max-h-[6em] md:w-[10em] md:min-w-[10em] md:h-[8em] md:max-h-[8em] rounded-lg overflow-clip">
				<Image
					className="grow object-cover object-center"
					height={500}
					width={500}
					alt={about ?? "News article image"}
					title={about}
					src={source}
					placeholder="blur"
					blurDataURL={placeholder}
				/>
			</div>
			<div className="card-details py-4 md:px-6 flex flex-col gap-1.5">
				<span className="title text-sm md:text-lg">{title}</span>
				<span className="byline text-xs md:text-sm text-gray-600">
					{author} | {dateString}
				</span>
				<p className="line-clamp-2 hidden">{snippet}</p>
			</div>
		</div>
	);
} as ModeledVoidComponent<NewsArticlePreviewModel>;

export default NewsArticlePreview;
