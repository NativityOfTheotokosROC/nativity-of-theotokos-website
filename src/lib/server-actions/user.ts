"use server";

import database from "../third-party/prisma";
import { Role } from "../types/general";
import { UserInformation } from "../utilities/user";
import { getUser } from "./auth";

export async function getUserInformation(): Promise<UserInformation> {
	const user = await getUser();
	if (!user) return null;
	const [roleRecords, isWriter, isEditor] = await Promise.all([
		database.admin.findMany({
			where: {
				email: user.email,
			},
			select: {
				role: true,
			},
		}),
		database.articleTicket.findFirst({
			where: { assigneeEmail: user.email },
		}),
		database.editor.findUnique({
			where: {
				email: user.email,
			},
		}),
	]);
	type ModifiedRole = Exclude<Role, "writer" | "editor">;
	const roles = roleRecords
		.map(record => record.role as ModifiedRole)
		.filter(role =>
			(["admin", "quotes", "staff", "user"] as const).includes(role),
		);
	let finalRoles: Role[] = roles;
	if (isWriter) finalRoles = [...finalRoles, "writer"];
	if (isEditor) finalRoles = [...finalRoles, "editor"];

	return {
		name: user.name,
		email: user.email,
		avatar: { source: user.image! },
		roles: finalRoles,
	};
}
