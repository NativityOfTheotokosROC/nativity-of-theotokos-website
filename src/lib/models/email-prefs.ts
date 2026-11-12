import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { NewEmailPrefs } from "../validation/email-prefs";
import { MakeRequired } from "../utilities/types";

export type EmailPrefs = MakeRequired<
	NewEmailPrefs,
	"isUnsubscribed" | "preferredLang"
>;

export type EmailPrefsModelView = {
	prefs: EmailPrefs;
	contact: {
		email: string;
		id: string;
	};
};

export type EmailPrefsModelInteraction =
	| InputModelInteraction<"TOGGLE_SUBSCRIBE", { value: boolean }>
	| InputModelInteraction<"UPDATE_PREFS", { id: string; prefs: EmailPrefs }>;

export type EmailPrefsModel = InteractiveModel<
	EmailPrefsModelView,
	EmailPrefsModelInteraction
>;
