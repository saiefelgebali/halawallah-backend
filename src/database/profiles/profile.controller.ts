import { ApolloError } from "apollo-server-errors";
import { Request, Response } from "express";
import { processRequestImage } from "../../api/process";
import ProfileService from "./profile.service";

class ProfileController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async getProfile(parent: any, args: any, context: any) {
		// Get username from either args or parent
		const username = args.username || parent.username;

		return await ProfileService.getProfile(username);
	}

	async followProfile(parent: any, args: any, context: any) {
		return await ProfileService.followProfile(
			context.user.username,
			args.following_username
		);
	}

	async getProfileFollowing(parent: any, args: any) {
		return await ProfileService.getProfileFollowing(
			parent.username,
			args.offset,
			args.limit
		);
	}

	async checkFollowing(parent: any, args: any, context: any) {
		// Return user's profile
		return ProfileService.checkFollowing(
			context.user.username,
			parent.username
		);
	}

	async getMyProfile(parent: any, args: any, context: any) {
		// Return requesting user's profile
		return ProfileService.getProfile(context.user.username);
	}

	async uploadPfp(req: Request, res: Response) {
		// Handle unauthorized users
		if (!req.user) {
			return res.status(403).send("Unauthenticated request");
		}

		try {
			// Process pfp image
			const pfp = await processRequestImage("pfp", req);

			// Upload pfp to db
			const result = await ProfileService.uploadPfp(
				req.user.username,
				pfp
			);

			// Return new profile details in json format
			res.json(result);
		} catch (error) {
			// Internal server error
			res.sendStatus(500).json(error);
		}
	}

	async updateProfile(parent: any, args: any, context: any) {
		// Return updated profile
		return await ProfileService.updateProfile(
			context.user.username,
			args.display,
			args.bio
		);
	}

	async searchProfile(parent: any, args: any) {
		// Returns a paginated response of profiles that match query
		return await ProfileService.searchProfile(
			args.query,
			args.offset,
			args.limit
		);
	}
}

export default new ProfileController();
