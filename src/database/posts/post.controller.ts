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
			return res.status(403).send("Unauthorized access");
		}

		// Process image
		await processRequestImage("post", req);

		// Return new post in json format
		res.json(
			await PostService.createPost(
				req.user.id,
				req.file.filename,
				req.body.caption
			)
		);
	}

	async getPostsByProfile(parent: any, args: any) {
		// Return paginated response of posts
		return await PostService.getPostsByProfile(
			args.profile_id | parent.profile_id,
			args.offset,
			args.limit
		);
	}

	async getMyFeed(parent: any, args: any, context: any) {
		// Try to access user_id from context
		const user = context.user;

		// Unauthenticated request
		if (!user) {
			return null;
		}

		// Authenticated request
		// Get relevant profile
		const profileId = await ProfileService.getProfileIDFromUserID(user.id);

		// Return paginated posts response
		return await PostService.getProfileFeed(
			profileId,
			args.offset,
			args.limit
		);
	}

	async deletePostById(parent: any, args: any, context: any) {
		// Try to access user from context
		const user = context.user;

		// Unauthenticated request
		if (!user) {
			return new ApolloError("Unauthenticated request");
		}

		// Get profile details
		const profile_id = await ProfileService.getProfileIDFromUserID(
			context.user.id
		);

		// Get post by id
		const post = await PostService.getPostById(args.post_id);

		// Ensure post exists
		if (!post) {
			return new ApolloError("Post does not exist");
		}

		// Ensure context user matches post profile
		if (post.profile_id === profile_id) {
			const result = await PostService.deletePostById(post.post_id);
			return result;
		}

		// Handle error
		else {
			return new ApolloError("Unauthorized to delete post");
		}
	}
}

export default new PostController();
