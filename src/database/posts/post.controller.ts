import { Request, Response } from "express";
import profileService from "../profiles/profile.service";
import PostService from "./post.service";

class PostController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async createPost(req: Request | any, res: Response) {
		// Handle unauthorized users
		if (!req.user_id) {
			return res.status(403).send("Unauthorized access");
		}

		// Return new post in json format
		res.json(
			await PostService.createPost(
				req.user_id,
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
		const userId = context.userId;

		// Unauthenticated request
		if (!userId) {
			return null;
		}

		// Authenticated request
		// Get relevant profile
		const profileId = await profileService.getProfileIDFromUserID(userId);

		// Return paginated posts response
		return await PostService.getProfileFeed(
			profileId,
			args.offset,
			args.limit
		);
	}
}

export default new PostController();
