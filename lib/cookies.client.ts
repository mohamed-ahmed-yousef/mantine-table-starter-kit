import Cookies from "js-cookie";

export const ACCESS_TOKEN_KEY = "the-access-token";
export const REFRESH_TOKEN_KEY = "the-refresh-token";

export const AccessTokenCookie = createCookieStorage(ACCESS_TOKEN_KEY);
export const RefreshTokenCookie = createCookieStorage(REFRESH_TOKEN_KEY);

const THREE_DAYS_ms = 1000 * 60 * 60 * 24 * 3;

function createCookieStorage<T extends string>(COOKIE_KEY: string) {
	return {
		set: (data: T, rootPath: string) => {
			Cookies.set(COOKIE_KEY, data, {
				expires: new Date(Date.now() + THREE_DAYS_ms),
				path: rootPath,
			});
		},
		get: () => {
			const data = Cookies.get(COOKIE_KEY);
			if (data) return data as T;
		},
		delete: () => {
			Cookies.remove(COOKIE_KEY);
		},
	};
}
