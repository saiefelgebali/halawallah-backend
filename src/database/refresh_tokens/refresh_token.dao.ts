import db from "../db";

class RefreshTokenDAO {
	async createRefreshToken(token: string, username: string) {
		return (
			await db("refresh_tokens")
				.insert({
					token,
					username,
				})
				.returning("*")
		)[0];
	}

	async deleteRefreshToken(token: string) {
		return await db("refresh_tokens").delete().where({ token });
	}

	async getTokenUser(token: string) {
		// Query for user related to specified refresh token
		return (
			await db("refresh_tokens")
				.select("users.username")
				.innerJoin("users", "users.username", "refresh_tokens.username")
				.where({ token })
		)[0];
	}
}

export default new RefreshTokenDAO();
