import type { AxiosInstance } from "axios";
import { z } from "zod";

export class AuthAPI {
	constructor(private http: AxiosInstance) {}

	login = async ({ ...data }: z.infer<typeof loginSchema>) => {
		return await this.http.post("/tokens/login", data);
	};

	getMe = async () => {
		return await this.http
			.get("users/me")
			.then((res) => res.data)
			.catch(() => "logout");
	};
}

export const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
});
