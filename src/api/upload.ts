import multer from "multer";
import { route } from "alamanah-express";
import { Request } from "express";
import PostController from "../database/posts/post.controller";
import ProfileController from "../database/profiles/profile.controller";
import ChatRoomController from "../database/chat_rooms/chatRoom.controller";

const imageFilter = (req: Request, file: Express.Multer.File, cb: any) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new Error("Not an image! Please upload an image."), false);
	}
};

// Upload posts
const postUpload = multer({
	storage: multer.memoryStorage(),
	fileFilter: imageFilter,
}).single("image");

// Update profile
const pfpUpload = multer({
	storage: multer.memoryStorage(),
	fileFilter: imageFilter,
}).single("pfp");

// Upload posts
const publicChatUpload = multer({
	storage: multer.memoryStorage(),
	fileFilter: imageFilter,
}).single("image");

// Upload post using multer middleware
export const uploadPostRoute = route({
	method: "POST",
	path: "/upload/post",
	view: PostController.createPost,
	middleware: postUpload,
});

// Update pfp using multer middleware
export const uploadPfpRoute = route({
	method: "POST",
	path: "/upload/pfp",
	view: ProfileController.uploadPfp,
	middleware: pfpUpload,
});

// Update pfp using multer middleware
export const uploadPublicChatRoute = route({
	method: "POST",
	path: "/upload/public_chat",
	view: ChatRoomController.uploadImage,
	middleware: publicChatUpload,
});
