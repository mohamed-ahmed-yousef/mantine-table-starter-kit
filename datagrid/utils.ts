import { download, generateCsv, mkConfig } from "export-to-csv";
import { get } from "lodash";
import type { MRT_ColumnDef, MRT_RowData } from "mantine-react-table";

export const csvConfig = mkConfig({
	fieldSeparator: ",",
	decimalSeparator: ".",
	useKeysAsHeaders: true,
});

export type OurTableColumnDef<TData extends MRT_RowData> =
	MRT_ColumnDef<TData> & {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		getExportedValue?: (value: any) => string | null | boolean;
	};

export const handleExportRows = <TData extends MRT_RowData>(data: TData[]) => {
	const csv = generateCsv(csvConfig)(data);
	download(csvConfig)(csv);
};

export const getExportedRow = <TData extends MRT_RowData>(
	columns: OurTableColumnDef<TData>[],
	row: TData,
) => {
	const exportedRow: Record<string, string | null | boolean> = {};
	for (const column of columns) {
		if (!column.accessorKey) continue;
		if (typeof column.getExportedValue === "function")
			exportedRow[column.accessorKey] = column.getExportedValue(row);
		else exportedRow[column.accessorKey] = get(row, column.accessorKey);
	}
	return exportedRow;
};
