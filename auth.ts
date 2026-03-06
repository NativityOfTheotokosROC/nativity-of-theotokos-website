import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./src/lib/third-party/prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	trustedOrigins: [
		"http://localhost:3000",
		...(process.env.VERCEL_URL
			? [`https://${process.env.VERCEL_URL}`]
			: []),
	],
});
