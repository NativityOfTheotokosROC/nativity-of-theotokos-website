import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins";
import { getYandexOAuthPlugin } from "@better-auth-extensions/yandex";
import prisma from "./src/lib/third-party/prisma";
import {
	BETTER_AUTH_URL,
	ENVIRONMENT,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	MICROSOFT_CLIENT_ID,
	MICROSOFT_CLIENT_SECRET,
	YANDEX_CLIENT_ID,
	YANDEX_CLIENT_SECRET,
} from "./src/lib/utilities/server-constants";

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	baseUrl:
		ENVIRONMENT === "development" ? "http://localhost:3000" : undefined,
	trustedOrigins: ["http://localhost:3000", BETTER_AUTH_URL],
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		},
		microsoft: {
			clientId: MICROSOFT_CLIENT_ID,
			clientSecret: MICROSOFT_CLIENT_SECRET,
		},
	},
	plugins: [
		genericOAuth({
			config: [
				getYandexOAuthPlugin(YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET),
			],
		}),
	],
});
