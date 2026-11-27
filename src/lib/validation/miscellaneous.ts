import z from "@/node_modules/zod/v4/classic/external.cjs";
import { Translator } from "../utilities/types";
import { getNullableStringSchema } from "./utilities";

export function getInsertLinkSchema(t?: Translator) {
	return z.object({
		url: z.httpUrl({
			error:
				t &&
				t("validation.invalidUrl", {
					field: t("insertLinkModal.linkFieldAlt"),
				}),
		}),
		label: getNullableStringSchema({ trim: true }),
	});
}
