import { route } from "alamanah-express";
import { postUpload } from "./upload";
import PostController from "../database/posts/post.controller";

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
		res.sendFile(`${process.cwd()}/media/img/post/${req.params.filename}`);
	},
});

export default [uploadPostRoute, getPostImageRoute];
