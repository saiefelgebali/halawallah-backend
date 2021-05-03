import { ApolloError } from "apollo-server-errors";
import { Request, Response } from "express";
import { processRequestImage } from "../../api/process";
import profileService from "./profile.service";
import ProfileService from "./profile.service";

class ProfileController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async getProfileById(parent: any, args: any, context: any) {
		// Get profile_id from either args or parent
		let profile_id;

		// Apply if profile_id is found in args
		if (args && args.profile_id) {
			profile_id = args.profile_id;
		}

		// Apply if profile_id is found in parent
		else if (parent && parent.profile_id) {
			profile_id = parent.profile_id;
		}

		// Apply if profile_id is in context
		else if (context && context.user.id) {
			profile_id = await ProfileService.getProfileIDFromUserID(
				context.user.id
			);
		}

		return await ProfileService.getProfile(profile_id);
	}

	async followProfile(parent: any, args: any, context: any) {
		// Unauthenticated users return null
		if (!context.user) {
			return null;
		}

		// Get respective profileId
		const profileId = await ProfileService.getProfileIDFromUserID(
			context.user.id
		);

		// Authenticated user can make a follow
		return await ProfileService.followProfile(profileId, args.following_id);
	}

	async getProfileFollowingById(parent: any, args: any) {
		return await ProfileService.getProfileFollowing(
			parent.profile_id,
			args.offset,
			args.limit
		);
	}

	async getMyProfile(parent: any, args: any, context: any) {
		// If user is authenticated - return user's profile
		if (context.user) {
			const profle_id = await ProfileService.getProfileIDFromUserID(
				context.user.id
			);
			return ProfileService.getProfile(profle_id);
		}

		// Otherwise return guest profile
		return null;
	}

	async uploadPfp(req: Request, res: Response) {
		// Handle unauthorized users
		if (!req.user) {
			return res.status(403).send("Unauthenticated request");
		}

		// Process pfp image
		await processRequestImage("pfp", req);

		// Get profile id
		const profile_id = await ProfileService.getProfileIDFromUserID(
			req.user.id
		);

		const result = await ProfileService.uploadPfp(
			profile_id,
			req.file.filename
		);

		// Return new profile details in json format
		res.json(result);
	}

	async updateProfile(parent: any, args: any, context: any) {
		// Authenticate user
		if (!context.user) {
			return new ApolloError(
				"You must be authenticated to updadte this profile"
			);
		}

		// Get profile id
		const profile_id = await ProfileService.getProfileIDFromUserID(
			context.user.id
		);

		// Return updated profile
		return await ProfileService.updateProfile(
			profile_id,
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
