import db from "../db";

class RefreshTokenDAO {
	async createRefreshToken(token: string, user_id: number) {
		return (
			await db("refresh_tokens")
				.insert({
					token,
					user_id,
				})
				.returning("*")
		)[0];
	}

	async deleteRefreshToken(token: string) {
		return await db("refresh_tokens").delete().where({ token });
	}

	async getTokenUserID(token: string) {
		// Query for user_id related to specified refresh token
		return (
			await db("refresh_tokens").select("user_id").where({ token })
		)[0].user_id;
	}

	async getTokenUser(token: string) {
		// Query for user related to specified refresh token
		return (
			await db("refresh_tokens")
				.select("users.user_id", "users.username")
				.innerJoin("users", "users.user_id", "refresh_tokens.user_id")
				.where({ token })
		)[0];
	}
}

export default new RefreshTokenDAO();
