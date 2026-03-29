"use server";

import { NavigationUserDetails } from "../model/user-navigation-widget";
import prisma from "../third-party/prisma";
import { Role } from "../type/general";
import { getUser } from "./auth";

export async function getNavigationUserDetails() {
	const user = await getUser();
	if (!user) return null;
	const roleRecords = await prisma.admin.findMany({
		where: {
			email: user.email,
		},
		select: {
			role: true,
		},
	});
	const roles = roleRecords
		.map(record => record.role)
		.filter(role =>
			["admin", "quotes", "staff", "user"].includes(role),
		) as Role[]; // HACK: Dirty
	return {
		name: user.name,
		avatar: { source: user.image! },
		roles,
	} satisfies NavigationUserDetails;
}
