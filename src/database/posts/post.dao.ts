import db from "../db";

class PostDAO {
	/**
	 * Post Data Access Object
	 * Contains relevant database operations for a Post instance
	 */

	async createPost(username: string, image: string, caption: string) {
		// Create a new post
		// Return new post details
		return (
			await db("posts")
				.insert({
					username,
					image,
					caption,
				})
				.returning("*")
		)[0];
	}

	async getProfileFeed(
		username: string,
		offset: number = 0,
		limit: number = 0
	) {
		// Gets a paginated response of the posts belonging to a profile

		// Get usernames of following
		const followingUsernames = (
			await db("profile_following")
				.select("following_username")
				.where("profile_username", username)
		).map((obj) => obj.following_username);

		// Include my username in array
		const usernames = [username, ...followingUsernames];

		// Get post data
		const data = await db("posts")
			.select("posts.*")
			.whereIn("username", usernames)
			.orderBy("posts.created_at", "desc")
			.offset(offset)
			.limit(limit);

		// Get pagination meta data
		const agg = (
			await db("posts")
				.innerJoin("profiles", "posts.username", "profiles.username")
				.innerJoin(
					"profile_following",
					"posts.username",
					"profile_following.following_username"
				)
				.where("profile_following.profile_username", username)
				.orWhere("posts.username", username)
				.count()
		)[0].count;

		const count = typeof agg === "number" ? agg : parseInt(agg);

		// Gets hasMore depending on if currently showing last index
		const hasMore = offset + limit < count;

		return {
			count,
			hasMore,
			data,
		};
	}

	async getPostsByProfile(username: string, offset: number, limit: number) {
		// Gets a paginated response of the posts belonging to a profile
		limit = limit || 0;
		offset = offset || 0;
		const data = await db("posts")
			.join("profiles", "posts.username", "profiles.username")
			.select("posts.*")
			.where("posts.username", username)
			.orderBy("posts.created_at", "desc")
			.offset(offset)
			.limit(limit);

		// Get pagination meta data
		const agg = (await db("posts").where("username", username).count())[0]
			.count;

		const count = typeof agg === "number" ? agg : parseInt(agg);

		// Gets hasMore depending on if currently showing last index
		const hasMore = offset + limit < count;

		return {
			count,
			hasMore,
			data,
		};
	}

	async getPostById(post_id: number) {
		// Get post by post_id
		return (await db("posts").select("*").where({ post_id }))[0];
	}

	async updatePostById(post_id: number, caption: string) {
		return (
			await db("posts")
				.update({ caption })
				.where({ post_id })
				.returning("*")
		)[0];
	}

	async deletePostById(post_id: number) {
		try {
			// Delete post by post_id
			await db("posts").delete().where({ post_id });
			return true;
		} catch {
			return false;
		}
	}
}

export default new PostDAO();
