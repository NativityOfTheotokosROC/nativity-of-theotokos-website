import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
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
	rowPinningFeature,
	rowSortingFeature,
	sortFn_text,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import {
	ArrowDownNarrowWideIcon,
	ArrowDownWideNarrowIcon,
	ArrowLeft,
	ArrowRight,
	ListIcon,
	PinIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Fragment, useMemo, useRef } from "react";
import { QuotesWidgetModel } from "../../models/quotes-widget";
import Quote from "../quote/Quote";

const defaultTableFeatures = {
	rowSortingFeature,
	rowPaginationFeature,
	rowPinningFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortFns: { text: sortFn_text },
};

const QuotesWidget = function ({ model }) {
	const { quotes, includeFilter, pinnedRows, modifiers } = model.modelView;
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
				columnHelper.accessor(row => row.author.name.english, {
					header: t("author"),
					id: "authorEn",
				}),
				columnHelper.accessor(row => row.author.name.russian, {
					header: `${t("author")} (${tMisc("russian")})`,
					id: "authorRu",
					//sortUndefined: "last",
				}),
				columnHelper.accessor(row => row.quote.english, {
					header: t("quote"),
					id: "quoteEn",
				}),
				columnHelper.accessor(row => row.quote.russian, {
					header: `${t("quote")} (${tMisc("russian")})`,
					id: "quoteRu",
					//sortUndefined: "last",
				}),
				columnHelper.accessor(row => row.source?.english, {
					header: t("source"),
					id: "sourceEn",
					//sortUndefined: "last",
				}),
				columnHelper.accessor(row => row.source?.russian, {
					header: `${t("source")} (${tMisc("russian")})`,
					id: "sourceRu",
					//sortUndefined: "last",
				}),
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
			rowPinning: pinnedRows
				? {
						top: pinnedRows,
						bottom: [],
					}
				: undefined,
		},
	});
	const { sorting, pagination } = table.state;
	const currentSortingColumnId = sorting[0]?.id;
	const isDesc = sorting[0]?.desc;
	const currentSortingColumn =
		table.getColumn(currentSortingColumnId)?.columnDef.header?.toString() ??
		t("none");
	const widgetRef = useRef<HTMLDivElement>(null);

	return (
		<div className="flex flex-col gap-3">
			<Menu>
				<>
					<MenuButton
						className={`flex w-fit items-center gap-3 self-end text-left text-sm uppercase`}
					>
						{t("sortedBy", { field: currentSortingColumn })}
						{isDesc && (
							<ArrowDownWideNarrowIcon strokeWidth={1.5} />
						)}
						{isDesc === false && (
							<ArrowDownNarrowWideIcon strokeWidth={1.5} />
						)}
						{isDesc === undefined && <ListIcon strokeWidth={1.5} />}
					</MenuButton>
					<MenuItems
						anchor="bottom end"
						transition
						className="z-1 mr-1 flex w-45 origin-top-right flex-col rounded-lg border border-white/15 bg-gray-800 text-sm opacity-95 transition duration-200 ease-out [--anchor-gap:--spacing(1)] *:w-full *:p-3 *:text-left *:uppercase *:hover:bg-gray-900/50 *:hover:text-[#ffdc4f] focus:outline-none *:active:bg-gray-950 *:active:text-[#ffdc4f] data-closed:scale-92 data-closed:opacity-0"
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
			</Menu>
			<div className="flex flex-col gap-3 overflow-clip rounded-lg border border-gray-400 bg-[#FEF8F3] p-5">
				<div
					className="flex h-[27em] max-h-[27em] flex-col gap-3 overflow-y-auto pr-5"
					ref={widgetRef}
				>
					{table.getTopRows().map(row => (
						<>
							<div key={row.id} className={`flex gap-2`}>
								<PinIcon className="size-9" fill="#88815899" />
								<Quote
									model={newReadonlyModel({
										quote: {
											...row.original,
											author: row.original.author.name,
										},
										variant: "miniaturized",
										modifiers,
									})}
								/>
							</div>
							<hr className="mt-3 opacity-30" />
						</>
					))}
					{table.getCenterRows().map(row => (
						<>
							<Quote
								model={newReadonlyModel({
									quote: {
										...row.original,
										author: row.original.author.name,
									},
									variant: "miniaturized",
									modifiers,
								})}
							/>
							<hr className="mt-3 opacity-30" />
						</>
					))}
				</div>
				<div className="flex items-center justify-end gap-4 text-sm">
					{table.getCanPreviousPage() && (
						<button
							onClick={() => {
								table.previousPage();
								widgetRef.current?.scrollTo({
									top: 0,
									behavior: "smooth",
								});
							}}
						>
							<ArrowLeft strokeWidth={1.5} />
						</button>
					)}
					{pagination.pageIndex + 1}
					{table.getCanNextPage() && (
						<button
							onClick={() => {
								table.nextPage();
								widgetRef.current?.scrollTo({
									top: 0,
									behavior: "smooth",
								});
							}}
						>
							<ArrowRight strokeWidth={1.5} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<QuotesWidgetModel>>;

export default QuotesWidget;
