"use server";

import { forbidden } from "next/navigation";
import { getUser } from "./auth";

export async function getNotifications() {
	const user = await getUser();
	if (!user) forbidden();
	return []; // TODO: We take it from here
}
