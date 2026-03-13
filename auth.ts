import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins";
import prisma from "./src/lib/third-party/prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	baseUrl:
		process.env.NODE_ENV == "development"
			? "http://localhost:3000"
			: undefined,
	trustedOrigins: [
		"http://localhost:3000",
		...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
	],
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: "yandex",
					clientId: process.env.YANDEX_CLIENT_ID!,
					clientSecret: process.env.YANDEX_CLIENT_SECRET!,
					authorizationUrl: "https://oauth.yandex.com/authorize",
					authorizationUrlParams: {
						scope: "login:email login:info login:avatar",
					},
					tokenUrl: "https://oauth.yandex.com/token",
					userInfoUrl: "https://login.yandex.ru/info?format=json",
					mapProfileToUser(profile) {
						return {
							id: profile.id,
							name:
								profile.display_name ??
								profile.real_name ??
								profile.first_name,
							email:
								profile.default_email ??
								profile.emails?.[0] ??
								null,
							image:
								!profile.is_avatar_empty &&
								profile.default_avatar_id
									? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`
									: null,
						};
					},
				},
			],
		}),
	],
});
