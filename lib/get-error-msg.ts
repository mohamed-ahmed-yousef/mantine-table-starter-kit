import { AxiosError } from "axios";

export function getErrorMsg(error: unknown) {
	if (error instanceof AxiosError) {
		return error.response?.data || "something went wrong";
	}
	return "Something went wrong";
}
