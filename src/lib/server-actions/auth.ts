"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { Role } from "../utilities/types";
import { getUserInformation } from "./user";

export async function protect(options?: Partial<{ roles: Role[] }>) {
	const requiredRoles: Role[] = ["admin", ...(options?.roles ?? [])];
	const user = await getUserInformation();

	if (!(user && user.roles.some(role => requiredRoles.includes(role))))
		forbidden();
	return user;
}

export async function getUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user ?? null;
	return user;
}
