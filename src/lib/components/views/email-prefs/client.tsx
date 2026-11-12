"use client";

import { useEmailPrefs } from "@/src/lib/model-implementations/email-prefs";
import { useToastNotifier } from "@/src/lib/model-implementations/notifier";
import { EmailPrefsModelView } from "@/src/lib/models/email-prefs";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import EmailPrefs from "./EmailPrefs";

const EmailPrefsClient = function ({ model }) {
	const { modelView } = model;
	const notifier = useToastNotifier();
	const emailPrefs = useEmailPrefs({ initialModelView: modelView, notifier });

	return <EmailPrefs model={emailPrefs} />;
} satisfies ModeledVoidComponent<ReadonlyModel<EmailPrefsModelView>>;

export default EmailPrefsClient;
