import ProfileService from "../profiles/profile.service";
import PostDAO from "./post.dao";

class PostService {
	/**
	 * Service layer
	 * Handles data connecting between the Controller and the Data Access Object (DAO)
	 */
	async createPost(user_id: number, image: string, caption: string) {
		// Get profile_id from user_id
		const profile_id = await ProfileService.getProfileIDFromUserID(user_id);

		return await PostDAO.createPost(profile_id, image, caption);
	}

	async getPostsByProfile(profile_id: number, offset: number, limit: number) {
		return PostDAO.getPostsByProfile(profile_id, offset, limit);
	}

	async getProfileFeed(profileId: number, offset: number, limit: number) {
		return PostDAO.getProfileFeed(profileId, offset, limit);
	}
}

export default new PostService();
