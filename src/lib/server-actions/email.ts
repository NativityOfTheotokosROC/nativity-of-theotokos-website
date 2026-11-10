"use server";

import resend from "../third-party/resend";

export async function unsubscribe(id: string) {
	const { error } = await resend.contacts.update({
		id,
		unsubscribed: true,
	});
	if (error) throw error;
}
