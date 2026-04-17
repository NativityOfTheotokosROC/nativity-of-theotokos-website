import z from "zod";
import { useTranslations } from "next-intl";
import { Translator } from "../types/general";

export function useLocalizedSchema<S extends ReturnType<typeof z.object>>(
	schemaFunction: (t: Translator) => S,
) {
	const t = useTranslations();
	return schemaFunction(t);
}
