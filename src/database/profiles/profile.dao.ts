import db from "../db";

class ProfileDAO {
	/**
	 * Profile Data Access Object
	 * Contains relevant database operations for a profile instance
	 */

	async createProfile(user: any) {
		return (
			await db("profiles")
				.insert({
					username: user.username,
					display: user.username,
				})
				.returning("*")
		)[0];
	}

	async getProfile(username: string) {
		return await db("profiles").select("*").where({ username }).first();
	}

	async followProfile(profile_username: string, following_username: string) {
		// Check if user already follows target
		const following = await db("profile_following")
			.select("*")
			.where({ profile_username, following_username });

		// Consider whether or not already following
		const isFollowing = following.length ? true : false;

		// If already following - delete row
		if (isFollowing) {
			await db("profile_following")
				.delete()
				.where({ profile_username, following_username });
		}

		// If not already following - insert new row
		else if (!isFollowing) {
			await db("profile_following").insert({
				profile_username,
				following_username,
			});
		}

		// Return new profile details
		return await db("profiles")
			.select("*")
			.where({ username: following_username })
			.first();
	}

	async checkFollowing(profile_username: string, following_username: string) {
		// Check if user already follows target
		const following = await db("profile_following")
			.select("*")
			.where({ profile_username, following_username });

		// Consider whether or not already following
		return following.length ? true : false;
	}

	async getProfileFollowing(username: string, offset: number, limit: number) {
		// Gets a paginated response of the profiles a user follows
		limit = limit || 0;
		offset = offset || 0;

		const data = await db("profile_following")
			.join(
				"profiles",
				"profile_following.following_username",
				"profiles.username"
			)
			.select("*")
			.where("profile_following.username", username)
			.orderBy("profile_following.created_at", "desc")
			.offset(offset)
			.limit(limit);

		const agg = (
			await db("profile_following").where("username", username).count()
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

	async updatePfp(username: string, pfp: string) {
		return (
			await db("profiles")
				.update({ pfp })
				.where({ username })
				.returning("*")
		)[0];
	}

	async updateProfile(username: string, display: string, bio: string) {
		// Cancel query if none provided
		if (!display && !bio) {
			return null;
		}

		// Make update
		return (
			await db("profiles")
				.update({ display, bio })
				.where({ username })
				.returning("*")
		)[0];
	}

	async searchProfile(query: string, offset: number, limit: number) {
		// Return a paginated response of all profiles
		// that match a query string
		limit = limit || 0;
		offset = offset || 0;

		// Get data
		const data = await db("profiles")
			.select("*")
			// Search for similar display names
			.where(
				db.raw('LOWER("display") like ?', `%${query.toLowerCase()}%`)
			)
			// Search for similar usernames
			.orWhere(
				db.raw('LOWER("username") like ?', `%${query.toLowerCase()}%`)
			)
			.orderBy("created_at", "desc")
			.offset(offset)
			.limit(limit);

		// Get pagination meta data
		const count = (
			await db("profiles")
				.count()
				.where(
					db.raw(
						'LOWER("display") like ?',
						`%${query.toLowerCase()}%`
					)
				)
				.orWhere(
					db.raw(
						'LOWER("username") like ?',
						`%${query.toLowerCase()}%`
					)
				)
		)[0].count as number;

		const hasMore = offset + limit < count;

		return {
			count,
			hasMore,
			data,
		};
	}
}

export default new ProfileDAO();
