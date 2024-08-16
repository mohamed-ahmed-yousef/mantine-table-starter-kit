import "server-only";

import { BACKEND_URL } from "@/lib/constants";

import {
	AccessTokenServerCookie,
	RefreshTokenServerCookie,
} from "@/lib/cookies.server";
import axios, { isAxiosError, type AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { redirect } from "@/navigation";
import { getCurrentServerUser, setServerSession } from "./session.server";

export const httpNoAuth = axios.create({
	baseURL: BACKEND_URL,
});

export const http = axios.create({
	baseURL: BACKEND_URL,
});

http.interceptors.request.use(async (config) => {
	const accessToken = await getAccessToken();
	if (accessToken) config.headers.set("Authorization", `Bearer ${accessToken}`);
	return config;
});

// Add a response interceptor
http.interceptors.response.use(
	(response) => response,
	async (error) => {
		console.error("====", error?.response?.status, error?.response?.data);
		const originalRequest = error.config;

		// If the error status is 401 and there is no originalRequest._retry flag,
		// it means the token has expired and we need to refresh it
		if (isAccessExpired(error)) {
			const session = getCurrentServerUser();
			console.info("access token is expired for user", session);
			// `throw error` here will cause the "catch" block to run in following try-catch statement
			if (originalRequest._retry) throw error;
			console.info("refreshing the access token");
			originalRequest._retry = true;

			try {
				const accessToken = await refreshAccessToken();
				if (!accessToken) throw null;
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return axios(originalRequest);
			} catch {
				setServerSession(null);
				redirect("/login");
				return;
			}
		}

		handleOtherFailures(error);
	},
);

httpNoAuth.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("====", error?.response?.status, error?.response?.data);
		handleOtherFailures(error);
	},
);

const refreshAccessToken = async () => {
	const refreshToken = RefreshTokenServerCookie.get();
	if (!refreshToken) return null;
	try {
		const accessToken = await getRefreshedToken({
			refreshToken,
		});
		// TODO: test and check the SSR scenario, when a request is made in a RSC, cookies can't be updated
		// Cookies can't be updated in the middleware as well but there should not be API calls in the middleware
		// So the problem exists only in during SSR
		setServerSession({
			accessToken,
			refreshToken,
		});
		return accessToken;
	} catch {}
	return null;
};

async function getRefreshedToken(data: { refreshToken: string }) {
	const {
		data: { access: accessToken },
	} = await httpNoAuth.post<{ access: string }>(
		"/accounts/token/refresh/",
		data,
	);
	return accessToken as string;
}

function isAccessExpired(error: unknown) {
	return (
		isAxiosError(error) &&
		typeof error.response?.data?.trace === "string" &&
		error.response?.data?.trace.includes("JWT")
	);
}

async function getAccessToken() {
	const accessToken = AccessTokenServerCookie.get();
	if (!accessToken) return await refreshAccessToken();
	try {
		const { exp } = jwtDecode<{ exp: number }>(accessToken);
		// refresh before expiration by 10 seconds to give the current
		// request enough time to be done
		if (new Date((exp + 10) * 1000) <= new Date())
			return await refreshAccessToken();
	} catch {}
	return accessToken;
}

function handleOtherFailures(error: AxiosError) {
	if (!error.response) {
		const message =
			"Can't connect to the backend server, contact the maintainers of the website!";
		throw { ...error, message };
	}

	throw error;
}
