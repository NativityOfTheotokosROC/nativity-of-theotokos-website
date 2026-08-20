"use server";

import { auth } from "@/auth";
import database from "@/src/lib/third-party/prisma";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { Role, User } from "../types/general";
import { IS_AUTH_DISABLED } from "../utilities/server-constants";

export async function protect(protectParams?: { roles?: Role[] }) {
	const roles = protectParams?.roles;
	const user = await getUser();

	if (IS_AUTH_DISABLED) return;
	if (!(user && (await isAuthorized(user, roles)))) return forbidden();
}

async function isAuthorized(user: User, roles?: Role[]) {
	const computedRoles: Role[] = ["admin", ...(roles ? roles : [])];
	const result = await database.admin.findFirst({
		where: {
			email: user.email,
			AND: { role: { in: computedRoles } },
		},
	});
	if (result) return true;
	for (const role of computedRoles) {
		if (role === "writer") {
			const result = await database.articleTicket.findFirst({
				where: {
					assigneeEmail: user.email,
				},
			});
			if (result) return true;
		}
		if (role === "editor") {
			const result = await database.editor.findFirst({
				where: {
					email: user.email,
				},
			});
			if (result) return true;
		}
	}
	return false;
}

export async function getUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user ?? null;
	return user;
}
