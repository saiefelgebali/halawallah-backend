import { Request } from "express";
import multer from "multer";

// Multer Storage - Sets destination and save - names
const postStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "media/img/post");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		// @ts-ignore
		cb(null, `user-${req.user_id}-${Date.now()}.${ext}`);
	},
});

// Image filter - ensures only images are saved
const imageFilter = (req: Request, file: Express.Multer.File, cb: any) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(null, false, new Error("Not an image! Please upload an image."));
	}
};

// Upload posts
export const postUpload = multer({
	storage: postStorage,
	fileFilter: imageFilter,
}).single("image");

// Upload profile pictures
export const pfpUpload = multer({
	dest: "media/img/pfp/",
	fileFilter: imageFilter,
}).single("image");
