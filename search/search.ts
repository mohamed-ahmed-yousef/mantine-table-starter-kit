import { type Entity, entity } from "@/search/entity";
import type { Operators } from "@/search/operator";

export function getSearchKey(
	filters: {
		key: string;
		value: string | number;
		operator: keyof typeof Operators;
	}[],
) {
	return filters.map((filter) => ({
		operator: filter.operator,
		key: filter.key,
		parameters: [
			filter.operator.startsWith("ENUM_") && {
				name: "enumType",
				value: filter.key,
			},
			{
				name: "value",
				value: filter.value,
			},
		].filter(Boolean),
	}));
}

export function SearchOperatorkey(currentEntity: Entity, id: string) {
	const OperatorMapper = {
		[entity.PUBLIC_BUCKET]: [{ id: "", key: "" }],
		[entity.BUCKET]: [
			{ id: "name", key: "NAME" },
			{ id: "currency", key: "CURRENCY" },
			{ id: "creditor.name", key: "CREDITOR_ID" },
		],
		[entity.USER]: [
			{
				id: "id",
				key: "ID",
			},
			{
				id: "fullName",
				key: "FULL_NAME",
			},
			{
				id: "phone",
				key: "PHONE",
			},
			{
				id: "email",
				key: "EMAIL",
			},
			{
				id: "username",
				key: "USERNAME",
			},
			{
				id: "status",
				key: "STATUS",
			},
			{
				id: "userType",
				key: "USER_TYPE",
			},
		],
		[entity.GROUP]: [{ id: "name", key: "NAME" }],
		[entity.DEBT]: [
			{ id: "name", key: "NAME" },
			{ id: "phone", key: "PHONE" },
			{ id: "creditor.name", key: "CREDITOR_ID" },
			{ id: "bucket.name", key: "BUCKET_ID" },
			{ id: "indebtedAmount", key: "INDEBTED_AMOUNT" },
			{ id: "confirmedAmount", key: "CONFIRMED_AMOUNT" },
			{ id: "attachedUser.fullName", key: "ATTACHED_USER_ID" },
		],
		[entity.SYS_EVENT]: [
			{ id: "causedBy", key: "CAUSED_BY" },
			{ id: "eventType", key: "EVENT_TYPE" },
			{ id: "timestamp", key: "TIME_STAMP" },
		],
		[entity.TEMPLATE]: [
			{ id: "name", key: "NAME" },
			{ id: "description", key: "DESCRIPTION" },
		],
		[entity.PROJECTIONS]: [{ id: "", key: "" }],
		[entity.PUBLIC_CREDITOR]: [{ id: "", key: "" }],
		[entity.PUBLIC_USER]: [{ id: "", key: "" }],
		[entity.CREDITOR]: [
			{ id: "name", key: "NAME" },
			{ id: "email", key: "EMAIL" },
			{ id: "phone", key: "PHONE" },
			{ id: "description", key: "DESCRIPTION" },
		],
	};
	return (
		OperatorMapper?.[currentEntity]?.find(
			(op: { id: string; key: string }) => op.id === id,
		)?.key || ""
	);
}
