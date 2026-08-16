import "server-only";
import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../utilities/server-constants";

const prismaAdapter = new PrismaPg({
	connectionString: DATABASE_URL,
});
const database = new PrismaClient({
	adapter: prismaAdapter,
});

export default database;
