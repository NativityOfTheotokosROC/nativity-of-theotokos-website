import "server-only";
import z from "zod";

const BASE_URL = z.url().parse(process.env.BASE_URL);
const ENVIRONMENT = z
	.enum(["production", "preview", "development"])
	.parse(process.env.VERCEL_ENV ?? process.env.NODE_ENV);

export { BASE_URL, ENVIRONMENT };
