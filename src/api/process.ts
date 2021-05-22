import { Request } from "express";
import sharp from "sharp";
import { getImagePath } from "./media";

function renameFile(prepend: any, extension: string) {
	return `${prepend}-${Date.now()}.${extension}`;
}

export async function processRequestImage(type: string, req: Request) {
	try {
		const filename = renameFile(req.user?.username, "png");
		await sharp(req.file.buffer)
			// Decrease file size
			.resize(600)
			.png({ quality: 90 })
			// Save image to path
			.toFile(getImagePath(type, filename));

		// Return new filename if successful
		return filename;
	} catch {
		console.log(`Error while processing image`);
		return null;
	}
}
