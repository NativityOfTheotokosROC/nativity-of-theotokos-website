import imageCompression from "browser-image-compression";
import z from "zod";

// export async function getDefaultAvatar(
// 	name: string,
// 	options?: Partial<{ email: string }>,
// ) {
// 	const parsedName = z.string().trim().nonempty().parse(name);
// }

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
