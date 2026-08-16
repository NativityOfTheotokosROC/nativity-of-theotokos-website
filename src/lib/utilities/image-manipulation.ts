import imageCompression from "browser-image-compression";

export async function compressImage(
	file: File,
	options?: Partial<{
		maxSizeMB: number;
		useWebWorker: boolean;
		maxWidthOrHeight: number;
	}>,
) {
	if (!file.type.startsWith("image/")) throw new Error("Invalid file type");

	const compressedImage = await imageCompression(file, {
		maxSizeMB: options?.maxSizeMB,
		maxWidthOrHeight: options?.maxWidthOrHeight,
		fileType: "image/webp",
		useWebWorker: options?.useWebWorker ?? true,
	});

	return compressedImage;
}
