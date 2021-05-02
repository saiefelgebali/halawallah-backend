import multer from "multer";
import { route } from "alamanah-express";
import { Request } from "express";
import PostController from "../database/posts/post.controller";

const postStorage = multer.diskStorage({
	// Choose where to store post images
	destination: (req, file, cb) => {
		cb(null, "media/img/post");
	},

	// Choose what name to save post images as
	filename: (req: Request, file, cb) => {
		// Extract file extension from mimetype
		const ext = file.mimetype.split("/")[1];

		// Specify new name format
		cb(null, `user-${req.user?.username}-${Date.now()}.${ext}`);
	},
});

const imageFilter = (req: Request, file: Express.Multer.File, cb: any) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(null, false, new Error("Not an image! Please upload an image."));
	}
};

// Upload posts
const postUpload = multer({
	storage: postStorage,
	fileFilter: imageFilter,
}).single("image");

// Upload post using multer middleware
export const uploadPostRoute = route({
	method: "POST",
	path: "/upload/post",
	view: PostController.createPost,
	middleware: postUpload,
});
