import { ScheduledQuoteModelView } from "@/src/lib/models/scheduled-quote";
import { BLANK_TRANSLATION } from "@/src/lib/utilities/constants";
import { pickDateTranslation } from "@/src/lib/utilities/date-time";
import { pickTranslation } from "@/src/lib/utilities/miscellaneous";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import {
	rowSortingFeature,
	rowPaginationFeature,
	createSortedRowModel,
	createPaginatedRowModel,
	sortFn_text,
	sortFn_datetime,
	tableFeatures,
	createColumnHelper,
	useTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import ScheduledQuote from "../../scheduled-quote/ScheduledQuote";

const features = tableFeatures({
	rowSortingFeature,
	rowPaginationFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortFns: { text: sortFn_text, datetime: sortFn_datetime },
});

const columnHelper = createColumnHelper<
	typeof features,
	ScheduledQuoteModelView["quote"]
>();

const ScheduledQuotes = function ({ model }) {
	const { quotes, modifiers } = model.modelView;
	const locale = useLocale();
	const t = useTranslations("manageQuotes");
	const tMisc = useTranslations("miscellaneous");
	const columns = useMemo(
		() =>
			columnHelper.columns([
				columnHelper.accessor(
					row => pickDateTranslation(row.date, locale),
					{ header: "Date", id: "date" },
				),
				columnHelper.accessor(
					row => pickTranslation(row.author.name, "en"),
					{ header: t("author"), id: "authorEn" },
				),
				columnHelper.accessor(
					row => pickTranslation(row.author.name, "ru"),
					{
						header: `${t("author")} (${tMisc("russian")})`,
						id: "authorRu",
					},
				),
				columnHelper.accessor(row => pickTranslation(row.quote, "en"), {
					header: t("quote"),
					id: "quoteEn",
				}),
				columnHelper.accessor(row => pickTranslation(row.quote, "ru"), {
					header: `${t("quote")} (${tMisc("russian")})`,
					id: "quoteRu",
				}),
				columnHelper.accessor(
					row =>
						pickTranslation(row.source ?? BLANK_TRANSLATION, "en"),
					{ header: t("source"), id: "sourceEn" },
				),
				columnHelper.accessor(
					row =>
						pickTranslation(row.source ?? BLANK_TRANSLATION, "ru"),
					{
						header: `${t("source")} (${tMisc("russian")})`,
						id: "sourceRu",
					},
				),
			]),
		[locale, t, tMisc],
	);
	const table = useTable({
		data: quotes,
		columns,
		features,
		getRowId: row => row.id.toString(),
		initialState: {
			sorting: [
				{
					id: "date",
					desc: false,
				},
			],
		},
	});
	const { pagination } = table.state;

	return (
		<div className="scheduled-quotes-section flex flex-col gap-4 border-t-3 border-[#dcb042] bg-white/70 p-8 py-9 md:py-10 lg:px-20">
			<span className="text-xl">{t("scheduledQuotes")}</span>
			<hr className="mb-4 opacity-50" />
			<div className="flex h-[27em] max-h-[27em] flex-col gap-3 overflow-y-auto rounded-lg border border-gray-400 bg-white p-5 lg:max-w-6/10">
				{table.getRowModel().rows.map(row => (
					<>
						<ScheduledQuote
							key={row.id}
							model={newReadonlyModel({
								quote: row.original,
								modifiers,
							})}
						/>
						<hr className="mt-3 opacity-30" />
					</>
				))}
			</div>
			<div className="flex items-center justify-end gap-4 text-sm">
				{table.getCanPreviousPage() && (
					<button onClick={table.previousPage}>
						<ArrowLeft strokeWidth={1.5} />
					</button>
				)}
				{pagination.pageIndex + 1}
				{table.getCanNextPage() && (
					<button onClick={table.nextPage}>
						<ArrowRight strokeWidth={1.5} />
					</button>
				)}
			</div>
		</div>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{
		quotes: ScheduledQuoteModelView["quote"][];
		modifiers: ScheduledQuoteModelView["modifiers"];
	}>
>;

export default ScheduledQuotes;
