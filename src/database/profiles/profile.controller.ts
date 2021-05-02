import profileService from "./profile.service";
import ProfileService from "./profile.service";

class ProfileController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async getProfileById(parent: any, args: any) {
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
}

export default new ProfileController();
