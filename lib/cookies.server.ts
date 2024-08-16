import "server-only";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./cookies.client";

export const RefreshTokenServerCookie = createCookieStorage(REFRESH_TOKEN_KEY);
export const AccessTokenServerCookie = createCookieStorage(ACCESS_TOKEN_KEY);

const THREE_DAYS_ms = 1000 * 60 * 60 * 24 * 3;

function createCookieStorage<T extends string>(COOKIE_KEY: string) {
	return {
		set: (data: T, rootPath: string) => {
			cookies().set(COOKIE_KEY, data, {
				expires: new Date(Date.now() + THREE_DAYS_ms),
				path: rootPath,
			});
		},
		get: () => {
			const data = cookies().get(COOKIE_KEY);
			if (data) return data.value as T;
		},
		delete: () => {
			cookies().delete(COOKIE_KEY);
		},
	};
}
