"use server";

import { headers } from "next/headers";

export async function getBaseURL() {
	const headersList = await headers();
	const host = headersList.get("host");
	const protocol =
		process.env.NODE_ENV == "production" ? "https://" : "http://";
	return `${protocol}${host?.slice(0, host.length)}`;
}
