import "server-only";
import resend from "../third-party/resend";

export async function getContact(id: string) {
	const { data, error } = await resend.contacts.get({ id });
	if (error && error.statusCode === 404) return null;
	if (error) throw error;
	return data;
}
