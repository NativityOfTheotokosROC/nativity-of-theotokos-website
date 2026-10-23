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
	globalFilteringFeature,
	rowPaginationFeature,
	rowPinningFeature,
	rowSortingFeature,
	sortFn_text,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import {
	ArrowDownAZIcon,
	ArrowDownZAIcon,
	ArrowLeft,
	ArrowRight,
	CheckIcon,
	ListIcon,
	PinIcon,
	Search,
	X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Fragment, useMemo, useRef, useState } from "react";
import { QuotesWidgetModel } from "../../models/quotes-widget";
import Quote from "../quote/Quote";
import { pickTranslation } from "../../utilities/miscellaneous";

const features = tableFeatures({
	rowSortingFeature,
	rowPaginationFeature,
	rowPinningFeature,
	columnFilteringFeature,
	globalFilteringFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filteredRowModel: createFilteredRowModel(),
	sortFns: { text: sortFn_text },
	filterFns: {
		includesString: filterFn_includesString,
	},
});

const QuotesWidget = function ({ model }) {
	const { quotes, pinnedRows, modifiers } = model.modelView;
	const t = useTranslations("manageQuotes");
	const locale = useLocale();

	const columnHelper = useMemo(
		() => createColumnHelper<typeof features, (typeof quotes)[number]>(),
		[],
	);
	const columns = useMemo(
		() =>
			columnHelper.columns([
				columnHelper.accessor(
					row => pickTranslation(row.author.name, locale),
					{
						header: t("author"),
						id: "author",
					},
				),
				columnHelper.accessor(
					row => pickTranslation(row.quote, locale),
					{
						header: t("quote"),
						id: "quote",
					},
				),
				columnHelper.accessor(
					row =>
						row.source
							? pickTranslation(row.source, locale)
							: undefined,
					{
						header: t("source"),
						id: "source",
					},
				),
			]),
		[columnHelper, t, locale],
	);
	const table = useTable({
		data: quotes,
		columns,
		features,
		getRowId: row => row.id.toString(),
		initialState: {
			sorting: [
				{
					id: "quote",
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
		globalFilterFn: "includesString",
	});
	const { sorting, pagination, globalFilter } = table.state;
	const currentSortingColumnId = sorting[0]?.id;
	const isDesc = sorting[0]?.desc;
	const currentSortingColumn = table
		.getColumn(currentSortingColumnId)
		?.columnDef.header?.toString();
	const listRef = useRef<HTMLDivElement>(null);
	const [isFilterOpen, setFilterOpen] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			<div className="list-tools flex w-full justify-end gap-2 self-end">
				<Menu>
					<>
						<MenuButton
							className={`flex w-fit items-center gap-2 text-left text-sm`}
						>
							{isDesc && (
								<ArrowDownZAIcon
									className="min-w-fit"
									strokeWidth={1.5}
								/>
							)}
							{isDesc === false && (
								<ArrowDownAZIcon
									className="min-w-fit"
									strokeWidth={1.5}
								/>
							)}
							{isDesc === undefined && (
								<ListIcon
									className="min-w-fit"
									strokeWidth={1.5}
								/>
							)}
							{!isFilterOpen &&
								(currentSortingColumn
									? t("sortedBy", {
											field: currentSortingColumn,
										})
									: t("unsorted"))}
						</MenuButton>
						<MenuItems
							anchor="bottom start"
							transition
							className="z-1 mr-1 flex w-45 max-w-50 origin-top-right flex-col rounded-lg border border-white/15 bg-gray-900 text-sm opacity-95 transition duration-200 ease-out [--anchor-gap:--spacing(1)] *:w-full *:p-3 *:px-4 *:text-left *:hover:bg-gray-900/50 *:hover:text-[#ffdc4f] focus:outline-none *:active:bg-gray-950 *:active:text-[#ffdc4f] data-closed:scale-92 data-closed:opacity-0"
						>
							{table.getHeaderGroups()[0].headers.map(header => (
								<MenuItem key={header.column.id} as={Fragment}>
									<button
										className="flex w-full items-center justify-between gap-3"
										onClick={e => {
											header.column.getToggleSortingHandler()?.(
												e,
											);
											listRef.current?.scrollTo({
												top: 0,
												behavior: "smooth",
											});
										}}
									>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
										{header.column.id ===
											currentSortingColumnId && (
											<CheckIcon strokeWidth={1.5} />
										)}
									</button>
								</MenuItem>
							))}
						</MenuItems>
					</>
				</Menu>
				<div className="flex flex-1 items-center gap-2">
					<>
						<input
							placeholder={t("searchQuotes")}
							value={globalFilter ?? ""}
							className={`grow overflow-clip rounded-lg border bg-[#FEF8F3] p-2 text-sm transition duration-300 ease-out ${isFilterOpen ? "w-full opacity-100" : "w-0 opacity-0"}`}
							onChange={e =>
								table.setGlobalFilter(e.target.value)
							}
							disabled={!isFilterOpen}
						/>
						<button
							className="flex"
							onClick={() => {
								if (isFilterOpen) {
									table.resetGlobalFilter();
								}
								setFilterOpen(filterOpen => !filterOpen);
							}}
						>
							{isFilterOpen ? (
								<X strokeWidth={1.5} />
							) : (
								<Search strokeWidth={1.5} />
							)}
						</button>
					</>
				</div>
			</div>
			<div className="flex flex-col gap-3 overflow-clip rounded-lg border border-gray-400 bg-[#FEF8F3] p-5">
				<div
					className="flex h-[27em] max-h-[27em] flex-col gap-3 overflow-y-auto pr-5"
					ref={listRef}
				>
					{pagination.pageIndex == 0 &&
						!globalFilter &&
						table.getTopRows().map(row => (
							<>
								<div key={row.id} className={`flex gap-2`}>
									<PinIcon
										className="size-5 min-w-5 -rotate-45"
										fill="#88815899"
										strokeWidth={1.25}
									/>
									<Quote
										model={newReadonlyModel({
											quote: {
												...row.original,
												author: row.original.author
													.name,
											},
											variant: "miniaturized",
											quoteStyle: "quotation_marks",
											modifiers,
										})}
									/>
								</div>
								<hr className="mt-3 opacity-30" />
							</>
						))}
					{(pinnedRows?.length && !globalFilter
						? table.getCenterRows()
						: table.getRowModel().rows
					).map(row => (
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
								listRef.current?.scrollTo({
									top: 0,
									behavior: "smooth",
								});
							}}
						>
							<ArrowLeft strokeWidth={1.5} />
						</button>
					)}
					{`${pagination.pageIndex + 1} ${t("paginationOf")} ${table.getPageCount()}`}
					{table.getCanNextPage() && (
						<button
							onClick={() => {
								table.nextPage();
								listRef.current?.scrollTo({
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
