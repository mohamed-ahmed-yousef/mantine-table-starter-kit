import { isAxiosError } from "axios";
import { getTranslations } from "next-intl/server";

export async function getErrorMessage(e: unknown): Promise<string> {
    const t = await getTranslations();
    return getErrorMessageSync(e, t);
}

export function getErrorMessageSync(
    e: unknown,
    t: Awaited<ReturnType<typeof getTranslations<never>>>,
): string {
    let msg = "something-went-wrong"
    if (isAxiosError(e)) msg = e.response?.data?.message || msg;
    return msg;
}
