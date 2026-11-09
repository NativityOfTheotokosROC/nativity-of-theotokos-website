import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";
import { Language } from "./types";

export function isValidLocale(locale: unknown): locale is Language {
	return hasLocale(routing.locales, locale);
}
