import { clientAPI } from "@/api/config/api.client";
import type { SearchOptions } from "@/api/services/search";
import { entity } from "@/search/entity";
import { useQuery } from "@tanstack/react-query";

export function useSearch<TData>({ options }: { options: SearchOptions }) {
	return useQuery({
		queryKey: [options],
		queryFn: () => clientAPI.search.getSearch<TData>(options),
	});
}

export function getCreditorsList() {
	const { data } = useSearch<{
		id: string;
		name: string;
		email: null;
	}>({
		options: {
			entity: entity.PUBLIC_CREDITOR,
			searchKeys: [],
			pageSize: 1e5,
			page: 0,
			sortBy: "NAME",
			descending: false,
		},
	});

	return (
		data?.map((item) => {
			return { label: item.name, value: item.id };
		}) || []
	);
}

export function getBucketList() {
	const { data } = useSearch<{
		id: string;
		name: string;
		email: null;
	}>({
		options: {
			entity: entity.PUBLIC_BUCKET,
			searchKeys: [],
			pageSize: 1e5,
			page: 0,
			sortBy: "NAME",
			descending: false,
		},
	});

	return (
		data?.map((item) => {
			return { label: item.name, value: item.id };
		}) || []
	);
}

export function getUserList() {
	const { data } = useSearch<{
		id: string;
		fullName: string;
		email: null;
	}>({
		options: {
			entity: entity.PUBLIC_USER,
			searchKeys: [],
			pageSize: 1e5,
			page: 0,
			sortBy: "NUMERICAL_ID",
			descending: false,
		},
	});

	return (
		data?.map((item) => {
			return { label: item.fullName, value: item.id };
		}) || []
	);
}
