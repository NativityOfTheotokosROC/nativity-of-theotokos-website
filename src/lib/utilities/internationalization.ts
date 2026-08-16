import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";
import { Language } from "../types/general";

export function isValidLocale(locale: string): locale is Language {
	return hasLocale(routing.locales, locale);
}
