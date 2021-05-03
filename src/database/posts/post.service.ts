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

	getPostsByProfile(profile_id: number, offset: number, limit: number) {
		return PostDAO.getPostsByProfile(profile_id, offset, limit);
	}

	getProfileFeed(profileId: number, offset: number, limit: number) {
		return PostDAO.getProfileFeed(profileId, offset, limit);
	}

	getPostById(post_id: number) {
		return PostDAO.getPostById(post_id);
	}

	updatePostById(post_id: number, caption: string) {
		return PostDAO.updatePostById(post_id, caption);
	}

	deletePostById(post_id: number) {
		return PostDAO.deletePostById(post_id);
	}
}

export default new PostService();
