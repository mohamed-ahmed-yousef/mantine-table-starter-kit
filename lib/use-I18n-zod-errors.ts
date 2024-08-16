import { useTranslations } from "next-intl";
import { z } from "zod";
import { makeZodI18nMap } from "./zod-error-map";

export const useI18nZodErrors = () => {
	const t = useTranslations("zod");
	const tForm = useTranslations("form");
	z.setErrorMap(makeZodI18nMap({ t, tForm }));
};
