import type { Entity } from "@/search/entity";
import type { AxiosInstance } from "axios";

export class SearchAPI {
	constructor(private http: AxiosInstance) {}
	getSearch = async <TData>(options: SearchOptions) => {
		return await this.http
			.post<TData[]>("/search", options)
			.then((res) => res.data);
	};
}

export interface SearchOptions {
	entity: Entity;
	searchKeys: Filter[] | [];
	pageSize: number;
	page: number;
	sortBy: string;
	descending: boolean;
}

export interface Filter {
	key: string;
	operator: string;
	parameters: (false | { name: string; value: string | number })[];
}
