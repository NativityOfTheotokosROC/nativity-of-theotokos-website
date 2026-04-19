import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { genericOAuth } from "better-auth/plugins";
import prisma from "./src/lib/third-party/prisma";
import {
	BETTER_AUTH_URL,
	ENVIRONMENT,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
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
	},
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: "yandex",
					clientId: YANDEX_CLIENT_ID,
					clientSecret: YANDEX_CLIENT_SECRET,
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
