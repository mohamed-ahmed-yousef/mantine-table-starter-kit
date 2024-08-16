import type { Entity } from "@/search/entity";
import { SearchOperatorkey } from "@/search/search";
import type { ColumnFiltersState } from "@tanstack/table-core";
import type { MRT_ColumnFilterFnsState } from "mantine-react-table";
type columnFilterProps = ColumnFiltersState;
type columnFilterFnProps = MRT_ColumnFilterFnsState;
import type { ColumnTypes } from "@/lib/types";

export enum Operators {
	STRING_CONTAINS = "STRING_CONTAINS",
	STRING_EQUALS = "STRING_EQUALS",
	INTEGER_EQUALS = "INTEGER_EQUALS",
	DOUBLE_EQUALS = "DOUBLE_EQUALS",
	DATE_EQUALS = "DATE_EQUALS",
	BOOLEAN_EQUALS = "BOOLEAN_EQUALS",
	ENUM_EQUALS = "ENUM_EQUALS",
	UUID_EQUALS = "UUID_EQUALS",
	INTEGER_IS_GREATER = "INTEGER_IS_GREATER",
	DOUBLE_IS_GREATER = "DOUBLE_IS_GREATER",
	INTEGER_IS_LESS = "INTEGER_IS_LESS",
	DOUBLE_IS_LESS = "DOUBLE_IS_LESS",
	INTEGER_IS_GREATER_OR_EQUALS = "INTEGER_IS_GREATER_OR_EQUALS",
	DOUBLE_IS_GREATER_OR_EQUALS = "DOUBLE_IS_GREATER_OR_EQUALS",
	INTEGER_IS_LESS_OR_EQUALS = "INTEGER_IS_LESS_OR_EQUALS",
	DOUBLE_IS_LESS_OR_EQUALS = "DOUBLE_IS_LESS_OR_EQUALS",
	DATE_BEFORE = "DATE_BEFORE",
	DATE_AFTER = "DATE_AFTER",
	STRING_ANY_MATCH = "STRING_ANY_MATCH",
	INTEGER_ANY_MATCH = "INTEGER_ANY_MATCH",
	DOUBLE_ANY_MATCH = "DOUBLE_ANY_MATCH",
	ENUM_ANY_MATCH = "ENUM_ANY_MATCH",
	UUID_ANY_MATCH = "UUID_ANY_MATCH",
	STRING_NO_MATCH = "STRING_NO_MATCH",
	INTEGER_NO_MATCH = "INTEGER_NO_MATCH",
	DOUBLE_NO_MATCH = "DOUBLE_NO_MATCH",
	ENUM_NO_MATCH = "ENUM_NO_MATCH",
	UUID_NO_MATCH = "UUID_NO_MATCH",
	IS_NULL = "IS_NULL",
	IS_NOT_NULL = "IS_NOT_NULL",
	DATE_TIME_AFTER = "DATE_TIME_AFTER",
	DATE_TIME_BEFORE = "DATE_TIME_BEFORE",
	DATE_TIME_EQUALS = "DATE_TIME_EQUALS",
}

export const Mapper = {
	string: {
		contains: Operators.STRING_CONTAINS,
		equals: Operators.STRING_EQUALS,
	},
	date: {
		equals: Operators.DATE_EQUALS,
		isBefore: Operators.DATE_BEFORE,
		isAfter: Operators.DATE_AFTER,
	},
	enum: {
		equals: Operators.ENUM_ANY_MATCH,
	},
	integer: {
		equals: Operators.INTEGER_EQUALS,
		isGreaterThan: Operators.INTEGER_IS_GREATER,
		isGreaterThanOrEqualTo: Operators.INTEGER_IS_GREATER_OR_EQUALS,
		isLessThan: Operators.INTEGER_IS_LESS,
		isLessThanOrEqualTo: Operators.INTEGER_IS_LESS_OR_EQUALS,
		isNotEqualTo: Operators.INTEGER_NO_MATCH,
	},
	double: {
		equals: Operators.DOUBLE_EQUALS,
		isGreaterThan: Operators.DOUBLE_IS_GREATER,
		isLessThan: Operators.DOUBLE_IS_LESS,
	},
	entity: {
		contains: Operators.STRING_CONTAINS,
		equals: Operators.STRING_EQUALS,
	},
	id: {
		contains: Operators.UUID_EQUALS,
		equals: Operators.UUID_EQUALS,
	},
};

export function mapColumnFilterFn(
	entity: Entity,
	columnFilterFn: columnFilterFnProps,
	columnFilter: columnFilterProps,
	columnTypes: ColumnTypes[],
) {
	const result = columnFilter.map((filter) => {
		const currColumn = columnTypes.find((col) => col.id === filter.id) as
			| ColumnTypes
			| undefined;

		const columnType = currColumn?.type as keyof typeof Mapper;
		//@ts-ignore
		const filterFnKey: keyof (typeof Mapper)[typeof columnType] =
			columnFilterFn[filter.id];
		const extraInfo = currColumn?.extraInfo;

		if (extraInfo && ["dateRange", "numberRange"].includes(extraInfo)) {
			// @ts-ignore
			if (!filter.value[0] || !filter.value[1]) {
				return [];
			}
			if (extraInfo === "numberRange") {
				return [
					{
						key: SearchOperatorkey(entity, filter.id),
						// @ts-ignore
						value: +filter.value[0],
						operator: Operators.INTEGER_IS_GREATER_OR_EQUALS,
					},
					{
						key: SearchOperatorkey(entity, filter.id),
						// @ts-ignore
						value: +filter.value[1],
						operator: Operators.INTEGER_IS_LESS_OR_EQUALS,
					},
				];
			}
			if (extraInfo === "dateRange") {
				//@ts-ignore
				const date1 = new Date(filter.value[0]);
				//@ts-ignore
				const date2 = new Date(filter.value[1]);
				return [
					{
						key: SearchOperatorkey(entity, filter.id),
						// @ts-ignore
						value: date1.toISOString(),
						operator: Operators.DATE_TIME_AFTER,
					},
					{
						key: SearchOperatorkey(entity, filter.id),
						// @ts-ignore
						value: date2.toISOString(filter.value[1]),
						operator: Operators.DATE_TIME_BEFORE,
					},
				];
			}
		}
		if (extraInfo === "dateRange") {
			console.log("dateRange");
		}
		return {
			key: SearchOperatorkey(entity, filter.id),
			value: filter.value as string,
			operator:
				Mapper?.[columnType]?.[filterFnKey] || Operators.STRING_CONTAINS,
		};
	});

	return result.flat();
}
