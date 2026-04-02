"use server";

import { headers } from "next/headers";
import z from "zod";

const baseURL = z.url().safeParse(process.env.BASE_URL);

export async function getBaseURL() {
	if (baseURL.success) return baseURL.data;
	const headersList = await headers();
	const host = headersList.get("host");
	const protocol =
		process.env.NODE_ENV == "production" ? "https://" : "http://";
	return `${protocol}${host?.slice(0, host.length)}`;
}
