import { ApolloError } from "apollo-server-errors";
import { Request, Response } from "express";
import { processRequestImage } from "../../api/process";
import ProfileService from "../profiles/profile.service";
import PostService from "./post.service";

class PostController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async createPost(req: Request, res: Response) {
		// Handle unauthorized users
		if (!req.user) {
			return res.status(403).send("Unauthenticated request");
		}

		try {
			// Process image
			const image = await processRequestImage("post", req);

			// Return new post in json format
			res.json(
				await PostService.createPost(
					req.user.username,
					image,
					req.body.caption
				)
			);
		} catch (error) {
			// Internal server error
			res.sendStatus(500).json(error);
		}
	}

	async getPostById(parent: any, args: any) {
		// Return specific post
		return await PostService.getPostById(args.post_id || parent.post_id);
	}

	async getPostsByProfile(parent: any, args: any) {
		// Return paginated response of posts
		return await PostService.getPostsByProfile(
			args.username || parent.username,
			args.offset,
			args.limit
		);
	}

	async getMyFeed(parent: any, args: any, context: any) {
		// Return paginated posts response
		return await PostService.getProfileFeed(
			context.user.username,
			args.offset,
			args.limit
		);
	}

	async deletePostById(parent: any, args: any, context: any) {
		// Get post by id
		const post = await PostService.getPostById(args.post_id);

		// Ensure post exists
		if (!post) {
			return new ApolloError("Post does not exist");
		}

		// Ensure context user matches post profile
		if (post.username === context.user.username) {
			const result = await PostService.deletePostById(post.post_id);
			return result;
		}

		// Handle error
		else {
			return new ApolloError("Unauthorized to delete post");
		}
	}

	async updatePostById(parent: any, args: any, context: any) {
		// Ensure post's profile matches context profile
		const post = await PostService.getPostById(args.post_id);

		// Check if requesting user is authorized to delete post
		if (post.username !== context.user.username) {
			return new ApolloError(
				"You do not have permission to update this post"
			);
		}

		// Return updated profile
		return await PostService.updatePostById(args.post_id, args.caption);
	}
}

export default new PostController();
