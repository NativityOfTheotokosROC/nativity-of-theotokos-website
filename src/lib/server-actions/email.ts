"use server";

import { notFound } from "next/navigation";
import resend from "../third-party/resend";
import { getEmailPrefsSchema, NewEmailPrefs } from "../validation/email-prefs";

export async function toggleSubscribe(id: string, value: boolean) {
	await updatePreferences({ id, prefs: { isUnsubscribed: !value } });
}

export async function updatePreferences(
	params:
		| { id: string; prefs: NewEmailPrefs }
		| { email: string; prefs: NewEmailPrefs },
) {
	const { isUnsubscribed, preferredLang, firstName, lastName } =
		getEmailPrefsSchema().parse(params.prefs);
	const identifier =
		"id" in params ? { id: params.id } : { email: params.email };
	const customPropertyEntries = Object.entries({ preferredLang });
	const nonUndefinedProperties = Object.fromEntries(
		customPropertyEntries.filter(([_, value]) => value !== undefined) as [
			string,
			Exclude<(typeof customPropertyEntries)[number][1], undefined>,
		][],
	);
	console.log(nonUndefinedProperties);
	const { error } = await resend.contacts.update({
		...identifier,
		unsubscribed: isUnsubscribed,
		firstName,
		lastName,
		properties: nonUndefinedProperties,
	});
	if (error && error.statusCode === 404) notFound();
	if (error) throw error;
}
