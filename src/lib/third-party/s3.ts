import { _Object, S3Client } from "@aws-sdk/client-s3";
import { S3_BUCKET, S3_BUCKET_REGION } from "../utilities/server-constants";

export function getObjectPublicURL(object: _Object) {
	return `https://${S3_BUCKET}.s3.${S3_BUCKET_REGION}.amazonaws.com/${object.Key}`;
}

export const s3 = new S3Client({ region: S3_BUCKET_REGION });
