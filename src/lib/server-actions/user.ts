"use server";

import database from "../third-party/prisma";
import { Role } from "../types/general";
import { UserInformation } from "../utilities/user";
import { getUser } from "./auth";

export async function getUserInformation(): Promise<UserInformation> {
	const user = await getUser();
	if (!user) return null;
	const roleRecords = await database.admin.findMany({
		where: {
			email: user.email,
		},
		select: {
			role: true,
		},
	});
	const isWriter = await database.articleTicket.findFirst({
		where: { userEmail: user.email },
	});
	type ModifiedRole = Exclude<Role, "writer">;
	const roles = roleRecords
		.map(record => record.role as ModifiedRole)
		.filter(role =>
			(["admin", "quotes", "staff", "user"] as const).includes(role),
		);
	return {
		name: user.name,
		email: user.email,
		avatar: { source: user.image! },
		roles: isWriter ? [...roles, "writer"] : roles,
	};
}
