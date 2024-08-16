import type { AxiosInstance } from "axios";
import { AuthAPI } from "../services/auth";
import {SearchAPI} from "@/api/services/search";

export function getAPI(http: AxiosInstance) {
	return {
		auth: new AuthAPI(http),
		search: new SearchAPI(http),
	};
}
