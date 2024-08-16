import "client-only";
import { AccessTokenCookie, RefreshTokenCookie } from "@/lib/cookies.client";
import { useMemo } from "react";

export interface SessionInfo {
	accessToken: string;
	refreshToken: string;
}

export function setSession(
	session: {
		accessToken: string;
		refreshToken: string;
	} | null,
) {
	if (!session) {
		AccessTokenCookie.delete();
		RefreshTokenCookie.delete();

		return;
	}
	const { accessToken, refreshToken } = session;
	AccessTokenCookie.set(accessToken, "/");
	RefreshTokenCookie.set(refreshToken, "/");
}

export function useCurrentUser() {
	const accessToken = AccessTokenCookie.get();
	const refreshToken = RefreshTokenCookie.get();

	const session = useMemo<SessionInfo | null>(() => {
		if (!accessToken || !refreshToken) return null;
		try {
			return {
				accessToken,
				refreshToken,
			};
		} catch (e) {
			AccessTokenCookie.delete();
			RefreshTokenCookie.delete();
			console.error(e);
			console.error("invalid access token", accessToken);
		}
		return null;
	}, [accessToken, refreshToken]);

	return session;
}
