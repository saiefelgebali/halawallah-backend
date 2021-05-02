import { route } from "alamanah-express";
import { Request, Response } from "express";
import fs from "fs";

enum ImageCategory {
	post = "post",
	pfp = "pfp",
}

// Return the absolute path to an image resource
export function getImagePath(type: string, filename: string) {
	return `${process.cwd()}/media/img/${type}/${filename}`;
}

// Handle requests to an image file
function handleGetImageRequest(req: Request, res: Response) {
	// Makes use of request url paramater ':category'
	// Ensure category is of a valid type ImageCategory
	const category = req.params.category;
	if (!(category in ImageCategory)) {
		// Send a 404 NOT FOUND response
		res.statusCode = 404;
		return res.send(`Could not find image category: ${category}`);
	}

	// Makes use of request url paramater ':filename'
	// Try to send requested file
	const filename = req.params.filename;
	const filepath = getImagePath(category, filename);

	// Check if the requested file exists
	if (fs.existsSync(filepath)) {
		return res.sendFile(filepath);
	}

	// Otherwise send a 404 NOT FOUND response
	else {
		res.statusCode = 404;
		return res.send(`Could not find image /${category}/${filename}`);
	}
}

export const getImageRoute = route({
	// Return static image serving route
	method: "GET",
	path: "/media/img/:category/:filename",
	view: handleGetImageRequest,
});
