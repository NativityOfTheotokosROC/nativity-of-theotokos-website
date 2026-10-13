import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import {
	columnFilteringFeature,
	createColumnHelper,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	flexRender,
	rowPaginationFeature,
	rowSortingFeature,
	sortFn_text,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Fragment, useMemo } from "react";
import { QuotesWidgetModel } from "../../models/quotes-widget";
import { BLANK_TRANSLATION } from "../../utilities/constants";
import { pickTranslation } from "../../utilities/miscellaneous";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import Quote from "../quote/Quote";

const defaultTableFeatures = {
	rowSortingFeature,
	rowPaginationFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortFns: { text: sortFn_text },
};

const QuotesWidget = function ({ model }) {
	const { quotes, includeFilter, modifiers } = model.modelView;
	const t = useTranslations("manageQuotes");
	const tMisc = useTranslations("miscellaneous");
	const locale = useLocale();
	const features = useMemo(
		() =>
			tableFeatures(
				includeFilter
					? {
							...defaultTableFeatures,
							columnFilteringFeature,
							filteredRowModel: createFilteredRowModel(),
							filterFns: {
								includesString: filterFn_includesString,
							},
						}
					: defaultTableFeatures,
			),
		[includeFilter],
	);
	const columnHelper = useMemo(
		() => createColumnHelper<typeof features, (typeof quotes)[number]>(),
		[],
	);
	const columns = useMemo(
		() =>
			columnHelper.columns([
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
		[t, tMisc, columnHelper],
	);
	const table = useTable({
		data: quotes,
		columns,
		features,
		getRowId: row => row.id.toString(),
		initialState: {
			sorting: [
				{
					id: locale === "ru" ? "quoteRu" : "quoteEn",
					desc: false,
				},
			],
		},
	});
	const { sorting, pagination } = table.state;
	const { id: currentSortingColumnId } = sorting[0];
	const currentSortingColumn = table
		.getColumn(currentSortingColumnId)
		?.columnDef.header?.toString();

	return (
		<div className="flex flex-col gap-3">
			<Menu>
				{({ open }) => (
					<>
						<MenuButton
							className={`flex items-center justify-end gap-6 p-3 text-left w-fit`}
						>
							{currentSortingColumn}
							<ChevronDown
								className={`transition duration-200 ease-out ${open ? "rotate-180" : ""}`}
								strokeWidth={1.5}
							/>
						</MenuButton>
						<MenuItems
							anchor="bottom end"
							transition
							className="z-1 mr-1 text-sm flex w-45 origin-top-right flex-col rounded-lg border border-white/15 bg-gray-800 transition duration-200 ease-out [--anchor-gap:--spacing(1)] *:w-full *:p-3 *:text-left *:uppercase *:hover:bg-gray-900/50 *:hover:text-[#ffdc4f] focus:outline-none *:active:bg-gray-950 *:active:text-[#ffdc4f] data-closed:scale-92 data-closed:opacity-0"
						>
							{table.getHeaderGroups()[0].headers.map(header => (
								<MenuItem key={header.column.id} as={Fragment}>
									<button
										onClick={header.column.getToggleSortingHandler()}
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</button>
								</MenuItem>
							))}
						</MenuItems>
					</>
				)}
			</Menu>
			<div className="flex gap-3 h-[27em] max-h-[27em] flex-col overflow-y-auto p-6">
				{table.getRowModel().rows.map(row => (
					<>
						<Quote
							key={row.id}
							model={newReadonlyModel({
								quote: {
									...row.original,
									author: row.original.author.name,
								},
								variant: "miniaturized",
								modifiers,
							})}
						/>
						<hr className="mt-6 opacity-65" />
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
} satisfies ModeledVoidComponent<InitializedModel<QuotesWidgetModel>>;

export default QuotesWidget;
