import PostDAO from "./post.dao";

class PostService {
	/**
	 * Service layer
	 * Handles data connecting between the Controller and the Data Access Object (DAO)
	 */
	async createPost(username: string, image: string, caption: string) {
		return await PostDAO.createPost(username, image, caption);
	}

	getPostsByProfile(username: string, offset: number, limit: number) {
		return PostDAO.getPostsByProfile(username, offset, limit);
	}

	getProfileFeed(username: string, offset: number, limit: number) {
		return PostDAO.getProfileFeed(username, offset, limit);
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
