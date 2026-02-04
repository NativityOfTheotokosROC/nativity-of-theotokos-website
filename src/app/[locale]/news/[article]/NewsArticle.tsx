import { NewsArticleModel } from "@/src/lib/model/news-article";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { toZonedTime } from "date-fns-tz";
import Image from "next/image";

const NewsArticle = function ({ model }) {
	const { title, author, articleImage, dateCreated, dateUpdated, body } =
		model.modelView.article;
	const { source, about, placeholder } = articleImage;
	return (
		<main className="newsarticle bg-[#FEF8F3] text-black">
			<div className="newsarticle-content flex flex-col p-8 gap-6 border-t-15 border-[#250203]/80">
				<span
					className={`title text-4xl/tight ${georgia.className} font-semibold`}
				>
					{title}
				</span>
				<div className="byline flex flex-col gap-1">
					<div className="flex items-center gap-2 -ml-8 pl-8 pr-3 text-white bg-gray-900/80 min-w-3/4 p-2">
						<span className="author text-base">{`By ${author}`}</span>
					</div>
					<span className="date text-lg">
						{`${toZonedTime(dateCreated, "CAT").toLocaleDateString(
							"en-uk",
							{
								dateStyle: "short",
							},
						)}${
							dateUpdated
								? ` (Updated: ${toZonedTime(
										dateUpdated,
										"CAT",
									).toLocaleDateString("en-uk", {
										dateStyle: "short",
									})})`
								: ""
						}`}
					</span>
				</div>
				<div className="flex justify-stretch items-stretch w-full h-[15em] max-h-[80dvh] rounded-lg overflow-clip">
					<Image
						className="grow object-cover object-center"
						height={538}
						width={538}
						alt={about ?? "News article image"}
						title={about}
						src={source}
						placeholder="blur"
						blurDataURL={placeholder}
					/>
				</div>
				<hr className="text-black/50 mt-3 w-full self-center" />
				<p className="body text-lg/relaxed">{body}</p>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<NewsArticleModel>;

export default NewsArticle;
