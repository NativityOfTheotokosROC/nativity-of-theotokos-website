"use server";

import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/src/lib/third-party/prisma";
import { Role, User } from "../type/general";

export async function protect(protectParams?: {
	roles?: Role[];
	signInEndpoint?: string;
}) {
	const signInEndpoint = protectParams?.signInEndpoint;
	const roles = protectParams?.roles;

	const user = await getUser();
	if (!user && signInEndpoint)
		return redirect(`/sign-in?endpoint=${signInEndpoint}`);
	if (!(user && (await isAuthorized(user, roles)))) return forbidden();
}

async function isAuthorized(user: User, roles?: Role[]) {
	const computedRoles: Role[] = ["admin", ...(roles ? roles : [])];
	const record = await prisma.admin.findFirst({
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
