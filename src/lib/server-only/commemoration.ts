import "server-only";
import database from "../third-party/prisma";

export async function getAllCommemorations() {
	return await database.commemoration.findMany();
}
