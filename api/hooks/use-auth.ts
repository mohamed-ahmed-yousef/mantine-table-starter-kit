import { clientAPI } from "@/api/config/api.client";
import { setSession } from "@/api/config/session.client";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin({
	onSuccess,
	onError,
}: { onSuccess?: () => void; onError?: () => void }) {
	return useMutation({
		mutationFn: clientAPI.auth.login,

		onSuccess: (data) => {
			notifySuccess({ title: "Login successful" });
			setSession(data.data);
			onSuccess?.();
		},
		onError: () => {
			notifyError({ title: "Login Failed" });
			onError?.();
		},
	});
}

export function useGetMe() {
	return useQuery({
		queryKey: ["USER"],
		queryFn: clientAPI.auth.getMe,
	});
}
