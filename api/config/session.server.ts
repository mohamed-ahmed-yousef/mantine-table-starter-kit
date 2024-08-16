import {
	AccessTokenServerCookie,
	RefreshTokenServerCookie,
} from "@/lib/cookies.server";
import { roles } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";

export function setServerSession(
	session: { accessToken: string; refreshToken: string } | null,
) {
	if (!session) {
		AccessTokenServerCookie.delete();
		RefreshTokenServerCookie.delete();
		return;
	}
	const { accessToken, refreshToken } = session;
	AccessTokenServerCookie.set(accessToken, "/");
	RefreshTokenServerCookie.set(refreshToken, "/");
}

export function getCurrentServerUser() {
	const accessToken = AccessTokenServerCookie.get();
	if (!accessToken) return null;
	try {
		const decoded = jwtDecode(accessToken);
		const data = z
			.object({
				id: z.string().uuid(),
				user_type: z.enum(roles),
			})
			.parse(decoded);
		return {
			userId: data.id,
			userType: data.user_type,
		};
	} catch (e) {
		try {
			// in a try-catch stmt because sometimes cookies can't be modified, i.e. in the edge runtime or during SSR
			AccessTokenServerCookie.delete();
			RefreshTokenServerCookie.delete();
		} catch {}
		console.error(e);
		console.error("invalid access token", accessToken);
	}
	return null;
}
