import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaAdapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
	adapter: prismaAdapter,
});

export default prisma;
