"use client";
import { clientAPI } from "@/api/config/api.client";
import type { Entity } from "@/search/entity";
import { mapColumnFilterFn } from "@/search/operator";
import { SearchOperatorkey, getSearchKey } from "@/search/search";
import { ActionIcon, Button, Group, Menu, Tooltip } from "@mantine/core";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
	type MRT_ColumnDef,
	type MRT_ColumnFilterFnsState,
	type MRT_ColumnFiltersState,
	type MRT_PaginationState,
	type MRT_RowData,
	type MRT_SortingState,
	MantineReactTable,
	useMantineReactTable,
} from "mantine-react-table";
//@ts-ignore
import { MRT_Localization_AR } from "mantine-react-table/locales/ar";
//@ts-ignore
import { MRT_Localization_EN } from "mantine-react-table/locales/en";
import { useEffect, useState } from "react";
import classes from "./table.module.css";
//-------css files-----------
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //If using mantine date picker;
import "mantine-react-table/styles.css";
import { getExportedRow, handleExportRows } from "@/datagrid/utils";
import { getErrorMessageSync } from "@/lib/err-msg";
import { notifyError } from "@/lib/notifications";
import type { ColumnTypes } from "@/lib/types";
import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";

export default function OurTable<TData extends MRT_RowData>({
	columnsFn,
	entity,
	columnTypes,
	allowableSortableKeysFn,
}: {
	columnsFn: () => MRT_ColumnDef<TData>[];
	entity: Entity;
	columnTypes: ColumnTypes[];
	allowableSortableKeysFn: (id: string) => string;
}) {
	const $t = useTranslations("");
	const t = useTranslations("Table");
	const locale = useLocale();
	const columns = columnsFn();
	const [columnsCount, setColumnsCount] = useState(0);

	//Manage MRT state that we want to pass to our API
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
		[],
	);
	const [columnFilterFns, setColumnFilterFns] = //filter modes
		useState<MRT_ColumnFilterFnsState>(
			Object.fromEntries(
				columns.map(({ accessorKey, columnFilterModeOptions }) => [
					accessorKey,
					columnFilterModeOptions ? columnFilterModeOptions[0] : "contains",
				]),
			),
		); //default to "contains" for all columns
	const [isExporting, setIsExporting] = useState(false);
	const [sorting, setSorting] = useState<MRT_SortingState>([]);
	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setColumnsCount((pagination.pageIndex + 1) * pagination.pageSize + 5);
	}, [pagination.pageSize, pagination.pageSize]);

	const options = mapColumnFilterFn(
		entity,
		columnFilterFns,
		columnFilters,
		columnTypes,
	);
	const searchOptions = getSearchKey(options);
	const { data, isError, isFetching, isLoading, refetch } = useQuery({
		queryKey: [
			entity,
			columnFilterFns,
			columnFilters,
			pagination.pageSize,
			pagination.pageIndex,
			sorting,
		],
		queryFn: () =>
			clientAPI.search.getSearch<TData>({
				entity: entity,
				searchKeys: searchOptions,
				pageSize: pagination.pageSize,
				page: pagination.pageIndex,
				sortBy: sorting?.[0]?.id
					? allowableSortableKeysFn(sorting?.[0]?.id)
					: allowableSortableKeysFn("default"),
				descending: sorting?.[0]?.desc ?? false,
			}),
	});

	//this will depend on your API response shape
	const fetchedUsers = data || [];
	const table = useMantineReactTable({
		columns,
		data: fetchedUsers,
		enableColumnFilterModes: true,
		initialState: { showColumnFilters: true },
		manualFiltering: true,
		manualPagination: true,
		manualSorting: true,
		mantineToolbarAlertBannerProps: isError
			? {
					color: "red",
					children: "Error loading data",
				}
			: undefined,
		onColumnFilterFnsChange: setColumnFilterFns,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		enableGlobalFilter: false,
		enableGrouping: true,
		enableRowSelection: true,
		enableBottomToolbar: true,
		enableFullScreenToggle: true,
		enableColumnResizing: true,
		enablePagination: true,
		enableColumnPinning: true,
		enableRowNumbers: true,
		defaultColumn: { size: 350 },
		enableClickToCopy: true,
		localization: locale === "ar" ? MRT_Localization_AR : MRT_Localization_EN,
		renderTopToolbarCustomActions: () => (
			<Group>
				<Tooltip label="Refresh Data">
					<ActionIcon onClick={() => refetch()}>
						<IconRefresh />
					</ActionIcon>
				</Tooltip>
				<Menu>
					<Menu.Target>
						<Button leftSection={<IconDownload />} variant="subtle" c="white">
							{t("export")}
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item
							disabled={
								table.getPrePaginationRowModel().rows.length === 0 ||
								isExporting
							}
							//export all rows, including from the next page, (still respects filtering and sorting)
							onClick={async () => {
								setIsExporting(true);
								try {
									const allData = await clientAPI.search.getSearch({
										entity: entity,
										searchKeys: searchOptions,
										pageSize: 1e9,
										page: 0,
										sortBy: sorting?.[0]?.id
											? SearchOperatorkey(entity, sorting?.[0]?.id)
											: "ID",
										descending: sorting?.[0]?.desc ?? false,
									});
									handleExportRows(
										allData.map((obj) => getExportedRow(columns, obj as TData)),
									);
								} catch (e) {
									const message = getErrorMessageSync(e, $t);
									notifyError({
										title: "Couldn't export all the rows",
										message,
									});
								}
								setIsExporting(false);
							}}
							leftSection={<IconDownload />}
						>
							{t("export-all-rows")}
						</Menu.Item>
						<Menu.Item
							disabled={table.getRowModel().rows.length === 0}
							//export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
							onClick={() =>
								handleExportRows(
									table
										.getRowModel()
										.rows.map((row) => getExportedRow(columns, row.original)),
								)
							}
							leftSection={<IconDownload />}
						>
							{t("export-page-rows")}
						</Menu.Item>
						<Menu.Item
							disabled={
								!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
							}
							//only export selected rows
							onClick={() =>
								handleExportRows(
									table
										.getSelectedRowModel()
										.rows.map((row) => getExportedRow(columns, row.original)),
								)
							}
							leftSection={<IconDownload />}
						>
							{t("export-selected-rows")}
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		),
		rowCount: columnsCount,
		state: {
			columnFilterFns,
			columnFilters,
			isLoading,
			pagination,
			showAlertBanner: isError,
			showProgressBars: isFetching,
			sorting,
		},
		mantineTableBodyProps: {
			style: {
				padding: "0px 15px",
			},
		},
		mantineTableHeadProps: {
			style: {
				padding: "0px 15px",
			},
		},
		mantineTableProps: {
			className: clsx(classes.table),
			highlightOnHover: false,
			withColumnBorders: true,
			// withRowBorders: true,
			striped: "odd",
			withTableBorder: true,
		},
	});

	return (
		<main className={"!space-y-3"}>
			<h2 className={"!font-bold !text-2xl"}>Column Title</h2>
			<MantineReactTable table={table} />
		</main>
	);
}
