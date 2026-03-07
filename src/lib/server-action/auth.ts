"use server";

import { User } from "better-auth";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/src/lib/third-party/prisma";

export async function isAuthorized(user: User, roles?: string[]) {
	const record = await prisma.admin.findUnique({
		where: {
			email: user.email,
			AND: roles ? { role: { in: roles } } : undefined,
		},
	});
	return record != null;
}

export async function getProtectedResource<T>(
	resource: () => T,
	resourceEndpoint: string,
	roles?: string[],
) {
	const user = await getUser();
	if (!user) redirect(`/sign-in?endpoint=${resourceEndpoint}`);
	await protect(user, roles);
	return resource();
}

export async function protect(user: User | null, roles?: string[]) {
	if (!(user && (await isAuthorized(user, roles)))) forbidden();
}

export async function getUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user ?? null;
	return user;
}
