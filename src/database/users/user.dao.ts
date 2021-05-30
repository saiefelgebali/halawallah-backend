import db from "../db";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../auth/tokens";

class UserDAO {
	/**
	 * User Data Access Object
	 * Contains relevant database operations for a user instance
	 */

	async loginUser(username: string, password: string) {
		try {
			const user = await db("users")
				.select("*")
				.where({ username })
				.first();

			// Validate username
			if (user === undefined) {
				return {
					error: "Invalid credentials",
				};
			}

			// Validate Password
			if (!(await bcrypt.compare(password, user.password))) {
				return {
					error: "Invalid credentials",
				};
			}

			// Generate tokens
			const refreshToken = await generateRefreshToken(user.username);
			const accessToken = generateAccessToken({
				username: user.username,
			});

			return {
				refreshToken,
				accessToken,
			};
		} catch (e) {
			return e;
		}
	}

	async createUser(username: string, password: string, admin?: boolean) {
		try {
			// Try to create a new user
			return (
				await db("users")
					.insert({
						username,
						password: await bcrypt.hash(password, 10),
						admin: !!admin,
					})
					.returning("*")
			)[0];
		} catch (e) {
			return e;
		}
	}

	async getUsers(usernames: string[]) {
		return await db("users").select("*").whereIn("username", usernames);
	}

	async getUser(username: string) {
		return await db("users").select("*").where({ username }).first();
	}
}

export default new UserDAO();
