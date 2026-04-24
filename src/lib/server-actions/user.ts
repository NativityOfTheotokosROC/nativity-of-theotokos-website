"use server";

import prisma from "../third-party/prisma";
import { Role } from "../types/general";
import { UserInformation } from "../utilities/user";
import { getUser } from "./auth";

export async function getUserInformation(): Promise<UserInformation> {
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
		.map(record => record.role as Role)
		.filter(role =>
			(["admin", "quotes", "staff", "user", "writer"] as const).includes(
				role,
			),
		);
	return {
		name: user.name,
		avatar: { source: user.image! },
		roles,
	};
}
