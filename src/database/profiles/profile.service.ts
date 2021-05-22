import ProfileDAO from "./profile.dao";

class ProfileService {
	/**
	 * Service layer
	 * Handles data connecting between the Controller and the Data Access Object (DAO)
	 */

	async getProfileIDFromUserID(user_id: number) {
		// Try to access profile id
		const result = await ProfileDAO.getProfileIDFromUserID(user_id);

		// Return the profile_id attribute
		if (result) {
			return result.profile_id;
		}
		// Return null if undefined
		else {
			return null;
		}
	}

	createProfile(newUser: any) {
		return ProfileDAO.createProfile(newUser);
	}
	followProfile(profile_id: number, following_id: number) {
		return ProfileDAO.followProfile(profile_id, following_id);
	}
	getProfile(id: number) {
		return ProfileDAO.getProfile(id);
	}
	getProfileByUsername(username: string) {
		return ProfileDAO.getProfileByUsername(username);
	}
	getProfileFollowing(id: number, offset: number, limit: number) {
		return ProfileDAO.getProfileFollowing(id, offset, limit);
	}

	uploadPfp(profile_id: number, pfp: string) {
		return ProfileDAO.updatePfp(profile_id, pfp);
	}

	updateProfile(profile_id: number, display: string, bio: string) {
		return ProfileDAO.updateProfile(profile_id, display, bio);
	}

	searchProfile(query: string, offset: number, limit: number) {
		return ProfileDAO.searchProfile(query, offset, limit);
	}
}

export default new ProfileService();
