import "server-only";
import prisma from "../third-party/prisma";

export async function getAllCommemorations() {
	return await prisma.commemoration.findMany();
}
