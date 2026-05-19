"use server";

import { auth } from "@/auth";
import database from "@/src/lib/third-party/prisma";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { Role, User } from "../types/general";
import {
	ENVIRONMENT,
	PREPRODUCTION_PROTECTION,
} from "../utilities/server-constants";

export async function protect(protectParams?: { roles?: Role[] }) {
	const roles = protectParams?.roles;
	const user = await getUser();

	if (
		ENVIRONMENT !== "production" &&
		PREPRODUCTION_PROTECTION?.toLowerCase() === "disabled"
	)
		return;
	if (!(user && (await isAuthorized(user, roles)))) return forbidden();
}

async function isAuthorized(user: User, roles?: Role[]) {
	const computedRoles: Role[] = ["admin", ...(roles ? roles : [])];
	const record = await database.admin.findFirst({
		where: {
			email: user.email,
			AND: { role: { in: computedRoles } },
		},
	});
	return record != null;
}

export async function getUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user ?? null;
	return user;
}
