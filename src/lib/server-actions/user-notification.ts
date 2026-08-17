"use server";

import { forbidden } from "next/navigation";
import { IS_AUTH_DISABLED } from "../utilities/server-constants";
import { getUser } from "./auth";

export async function getNotifications() {
	const user = await getUser();
	if (!IS_AUTH_DISABLED && !user) forbidden();
	return [];
}
