import imageCompression from "browser-image-compression";

export async function compressImage(
	file: File,
	options?: Partial<{
		maxSizeMB: number;
		useWebWorker: boolean;
		maxWidthOrHeight: number;
		useWebp: boolean;
	}>,
) {
	if (!file.type.startsWith("image/")) throw new Error("Invalid file type");

	const compressedImage = await imageCompression(file, {
		maxSizeMB: options?.maxSizeMB,
		maxWidthOrHeight: options?.maxWidthOrHeight,
		fileType: options?.useWebp ? "image/webp" : file.type,
		useWebWorker: options?.useWebWorker ?? true,
	});

	return {
		compressedImage,
		extension: options?.useWebp
			? "webp"
			: file.type
					.split(".")
					.findLast(segment => typeof segment === "string"),
	};
}
