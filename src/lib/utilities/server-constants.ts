import "server-only";
import z from "zod";

export const DATABASE_URL = z
	.string()
	.trim()
	.nonempty()
	.parse(process.env.DATABASE_URL);
export const BASE_URL = z.url().parse(process.env.BASE_URL);
export const ENVIRONMENT = z
	.enum(["production", "preview", "development"])
	.parse(process.env.VERCEL_ENV ?? process.env.NODE_ENV);
export const BETTER_AUTH_URL = z.url().parse(process.env.BETTER_AUTH_URL);
export const GOOGLE_CLIENT_ID = z
	.string()
	.nonempty()
	.parse(process.env.GOOGLE_CLIENT_ID);
export const GOOGLE_CLIENT_SECRET = z
	.string()
	.nonempty()
	.parse(process.env.GOOGLE_CLIENT_SECRET);
export const MICROSOFT_CLIENT_ID = z
	.string()
	.nonempty()
	.parse(process.env.MICROSOFT_CLIENT_ID);
export const MICROSOFT_CLIENT_SECRET = z
	.string()
	.nonempty()
	.parse(process.env.MICROSOFT_CLIENT_SECRET);
export const YANDEX_CLIENT_ID = z
	.string()
	.nonempty()
	.parse(process.env.YANDEX_CLIENT_ID);
export const YANDEX_CLIENT_SECRET = z
	.string()
	.nonempty()
	.parse(process.env.YANDEX_CLIENT_SECRET);
export const MAILERLITE_API_KEY = z
	.string()
	.nonempty()
	.parse(process.env.MAILERLITE_API_KEY);
export const S3_BUCKET = z.string().nonempty().parse(process.env.S3_BUCKET);
export const AWS_ACCESS_KEY_ID = z
	.string()
	.nonempty()
	.parse(process.env.AWS_ACCESS_KEY_ID);
export const AWS_SECRET_ACCESS_KEY = z
	.string()
	.nonempty()
	.parse(process.env.AWS_SECRET_ACCESS_KEY);
// TODO: Rename bucket region
export const S3_BUCKET_REGION = z
	.string()
	.nonempty()
	.parse(process.env.S3_BUCKET_REGION);
export const PREPRODUCTION_PROTECTION = process.env.PREPRODUCTION_PROTECTION;
export const IS_AUTH_DISABLED =
	PREPRODUCTION_PROTECTION?.toLowerCase() === "disabled" &&
	ENVIRONMENT !== "production";
