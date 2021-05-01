import db from "../db";

class PostDAO {
	/**
	 * Post Data Access Object
	 * Contains relevant database operations for a Post instance
	 */

	async createPost(profile_id: number, image: string, caption: string) {
		// Create a new post
		// Return new post details
		return (
			await db("posts")
				.insert({
					profile_id,
					image,
					caption,
				})
				.returning("*")
		)[0];
	}

	async getProfileFeed(profile_id: number, offset: number, limit: number) {
		// Gets a paginated response of the posts belonging to a profile
		limit = limit || 0;
		offset = offset || 0;

		// Get post data
		const data = await db("posts")
			.select("*")
			.innerJoin(
				"profile_following",
				"posts.profile_id",
				"profile_following.following_id"
			)
			.where("profile_following.profile_id", profile_id)
			.orderBy("posts.created_at", "desc")
			.offset(offset)
			.limit(limit);

		// Get pagination meta data
		const agg = (
			await db("posts")
				.innerJoin(
					"profile_following",
					"posts.profile_id",
					"profile_following.following_id"
				)
				.where("profile_following.profile_id", profile_id)
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

	async getPostsByProfile(profile_id: number, offset: number, limit: number) {
		// Gets a paginated response of the posts belonging to a profile
		limit = limit || 0;
		offset = offset || 0;
		const data = await db("posts")
			.join("profiles", "posts.profile_id", "profiles.profile_id")
			.select("*")
			.where("posts.profile_id", profile_id)
			.orderBy("posts.created_at", "desc")
			.offset(offset)
			.limit(limit);

		// Get pagination meta data
		const agg = (
			await db("posts").where("profile_id", profile_id).count()
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
}

export default new PostDAO();
