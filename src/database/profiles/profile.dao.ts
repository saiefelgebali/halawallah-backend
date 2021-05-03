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
					display: user.username,
					user_id: user.user_id,
				})
				.returning("*")
		)[0];
	}

	async getProfile(id: number) {
		return await db("profiles")
			.select("*")
			.where({ profile_id: id })
			.first();
	}

	async getProfileIDFromUserID(user_id: number) {
		return await db("profiles")
			.select("profile_id")
			.where({ user_id })
			.first();
	}

	async followProfile(profile_id: number, following_id: number) {
		// Check if user already follows target
		const following = await db("profile_following")
			.select("*")
			.where({ profile_id, following_id });

		// Consider whether or not already following
		const isFollowing = following.length ? true : false;

		// If already following - delete row
		if (isFollowing) {
			await db("profile_following")
				.delete()
				.where({ profile_id, following_id });
			return false;
		}

		// If not already following - insert new row
		else if (!isFollowing) {
			await db("profile_following").insert({ profile_id, following_id });
			return true;
		}
	}

	async getProfileFollowing(id: number, offset: number, limit: number) {
		// Gets a paginated response of the profiles a user follows
		limit = limit || 0;
		offset = offset || 0;
		const data = await db("profile_following")
			.join(
				"profiles",
				"profile_following.following_id",
				"profiles.profile_id"
			)
			.select("*")
			.where("profile_following.profile_id", id)
			.orderBy("profile_following.created_at", "desc")
			.offset(offset)
			.limit(limit);

		const agg = (
			await db("profile_following").where("profile_id", id).count()
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

	async updatePfp(profile_id: number, pfp: string) {
		return (
			await db("profiles")
				.update({ pfp })
				.where({ profile_id })
				.returning("*")
		)[0];
	}

	async updateProfile(profile_id: number, display: string, bio: string) {
		// Cancel query if none provided
		if (!display && !bio) {
			return null;
		}

		// Make update
		return (
			await db("profiles")
				.update({ display, bio })
				.where({ profile_id })
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
			.select("profiles.*", "users.username")
			.innerJoin("users", "users.user_id", "profiles.user_id")

			// Search for similar display names
			.where(
				db.raw('LOWER("display") like ?', `%${query.toLowerCase()}%`)
			)

			// Search for similar usernames
			.orWhere(
				db.raw('LOWER("username") like ?', `%${query.toLowerCase()}%`)
			)
			.orderBy("profiles.created_at", "desc")
			.offset(offset)
			.limit(limit);

		// Get pagination meta data
		const count = (
			await db("profiles")
				.count()
				.innerJoin("users", "users.user_id", "profiles.user_id")
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
