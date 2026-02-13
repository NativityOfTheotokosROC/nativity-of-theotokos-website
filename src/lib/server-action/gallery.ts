"use server";

import {
	ListObjectsV2Command,
	ListObjectsV2Request,
	S3Client,
} from "@aws-sdk/client-s3";
import { getObjectPublicURL } from "../third-party/s3";

export async function getGalleryImages() {
	const client = new S3Client({
		region: process.env.S3_BUCKET_REGION,
	});
	const prefix = "gallery/";
	const input: ListObjectsV2Request = {
		Bucket: process.env.S3_BUCKET,
		Prefix: prefix,
	};
	const command = new ListObjectsV2Command(input);
	const galleryImages = await client.send(command);
	if (!galleryImages.Contents)
		throw new Error("Could not retrieve gallery images from repository");
	return [
		...galleryImages.Contents.map(object => ({
			imageLink: getObjectPublicURL(object),
		})).filter(galleryImage => !galleryImage.imageLink.endsWith(prefix)),
	];
}
