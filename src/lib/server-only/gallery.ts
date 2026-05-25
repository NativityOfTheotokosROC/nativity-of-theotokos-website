import "server-only";

import { ListObjectsV2Command, ListObjectsV2Request } from "@aws-sdk/client-s3";
import { getObjectPublicURL, s3 } from "../third-party/s3";
import { S3_BUCKET } from "../utilities/server-constants";

export async function getGalleryImages() {
	const prefix = "gallery/";
	const input: ListObjectsV2Request = {
		Bucket: S3_BUCKET,
		Prefix: prefix,
	};
	const command = new ListObjectsV2Command(input);
	const galleryImages = await s3.send(command);
	if (!galleryImages.Contents)
		throw new Error("Could not retrieve gallery images from repository");
	return [
		...galleryImages.Contents.map(object => ({
			imageLink: getObjectPublicURL(object),
		})).filter(galleryImage => !galleryImage.imageLink.endsWith(prefix)),
	];
}
