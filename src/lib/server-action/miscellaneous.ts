"use server";

import z from "zod";

const baseURL = z.url().safeParse(process.env.BASE_URL);

export async function getBaseURL() {
	if (baseURL.success) return baseURL.data;
	throw new Error("Base URL is not defined");
}
