"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_BUCKET } from "../utilities/server-constants";
import { s3 } from "../third-party/s3";
import { protect } from "./auth";

export async function getPresignedUrl(
	fileName: string,
	folder: string,
	contentType: string,
) {
	await protect({ roles: ["editor", "admin"] });
	const command = new PutObjectCommand({
		Bucket: S3_BUCKET,
		Key: `${folder}/${fileName}`,
		ContentType: contentType,
	});
	return await getSignedUrl(s3, command, { expiresIn: 3600 });
}
