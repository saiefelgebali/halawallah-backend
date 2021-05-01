import { route } from "alamanah-express";
import { postUpload } from "./upload";
import PostController from "../database/posts/post.controller";
import { getImagePath } from "./static";

// Upload post using multer middleware
const uploadPostRoute = route({
	method: "POST",
	path: "/upload/post",
	view: PostController.createPost,
	middleware: postUpload,
});

// Get image using url params
const getPostImageRoute = route({
	method: "GET",
	path: "/media/img/post/:filename",
	view: (req, res) => {
		return res.sendFile(getImagePath("post", req.params.filename));
	},
});

export default [uploadPostRoute, getPostImageRoute];
