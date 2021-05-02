import db from "../db";

class CommentDAO {
	/**
	 * Comment Data Access Object
	 * Contains relevant database operations relating to the comments table
	 */

	async createComment(text: string, profile_id: number, post_id: number) {
		// Create & return a new comment
		return (
			await db("comments")
				.insert({
					text,
					profile_id,
					post_id,
				})
				.returning("*")
		)[0];
	}

	async getPostComments(post_id: number, offset: number, limit: number) {
		// Paginated response
		// Return a post's related comments
		limit = limit || 0;
		offset = offset || 0;

		// Get comments
		const data = await db("comments")
			.select("*")
			.innerJoin("posts", "posts.post_id", "comments.post_id")
			.where("posts.post_id", post_id)
			.orderBy("comments.created_at", "desc")
			.offset(offset)
			.limit(limit);

		// Get pagination meta data
		const agg = (
			await db("comments")
				.innerJoin("posts", "posts.post_id", "comments.post_id")
				.where("posts.post_id", post_id)
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
}

export default new CommentDAO();