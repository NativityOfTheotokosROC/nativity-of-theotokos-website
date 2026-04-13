import "server-only";
import z from "zod";

const BASE_URL = z.url().parse(process.env.BASE_URL);
const ENVIRONMENT = z
	.enum(["production", "preview", "development"])
	.parse(process.env.VERCEL_ENV ?? process.env.NODE_ENV);
const BETTER_AUTH_URL = z.url().parse(process.env.BETTER_AUTH_URL);
const GOOGLE_CLIENT_ID = z
	.string()
	.nonempty()
	.parse(process.env.GOOGLE_CLIENT_ID);
const GOOGLE_CLIENT_SECRET = z
	.string()
	.nonempty()
	.parse(process.env.GOOGLE_CLIENT_SECRET);
const YANDEX_CLIENT_ID = z
	.string()
	.nonempty()
	.parse(process.env.YANDEX_CLIENT_ID);
const YANDEX_CLIENT_SECRET = z
	.string()
	.nonempty()
	.parse(process.env.YANDEX_CLIENT_SECRET);
const MAILERLITE_API_KEY = z
	.string()
	.nonempty()
	.parse(process.env.MAILERLITE_API_KEY);

export {
	BASE_URL,
	ENVIRONMENT,
	BETTER_AUTH_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	YANDEX_CLIENT_ID,
	YANDEX_CLIENT_SECRET,
	MAILERLITE_API_KEY,
};
