import ProfileDAO from "./profile.dao";

class ProfileService {
	/**
	 * Service layer
	 * Handles data connecting between the Controller and the Data Access Object (DAO)
	 */

	createProfile(newUser: any) {
		return ProfileDAO.createProfile(newUser);
	}
	followProfile(profile_username: string, following_username: string) {
		return ProfileDAO.followProfile(profile_username, following_username);
	}
	checkFollowing(profile_username: string, following_username: string) {
		return ProfileDAO.checkFollowing(profile_username, following_username);
	}
	getProfile(username: string) {
		return ProfileDAO.getProfile(username);
	}
	getProfileFollowing(username: string, offset: number, limit: number) {
		return ProfileDAO.getProfileFollowing(username, offset, limit);
	}

	uploadPfp(username: string, pfp: string) {
		return ProfileDAO.updatePfp(username, pfp);
	}

	updateProfile(username: string, display: string, bio: string) {
		return ProfileDAO.updateProfile(username, display, bio);
	}

	searchProfile(query: string, offset: number, limit: number) {
		return ProfileDAO.searchProfile(query, offset, limit);
	}
}

export default new ProfileService();
