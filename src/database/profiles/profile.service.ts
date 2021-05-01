import ProfileDAO from "./profile.dao";

class ProfileService {
	/**
	 * Service layer
	 * Handles data connecting between the Controller and the Data Access Object (DAO)
	 */

	async getProfileIDFromUserID(user_id: number) {
		// Return the profile_id attribute of relevant profile object
		return (await ProfileDAO.getProfileIDFromUserID(user_id)).profile_id;
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
	getProfileFollowing(id: number, offset: number, limit: number) {
		return ProfileDAO.getProfileFollowing(id, offset, limit);
	}
}

export default new ProfileService();
