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
			const refreshToken = await generateRefreshToken(user.user_id);
			const accessToken = generateAccessToken({
				id: user.user_id,
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
		/**
		 * Inserts a new user into the "users" table
		 * @param user Object containing parameters to insert a new user into the "users" table
		 * @returns {number?} id of the created user
		 */
		try {
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

	async getUsers(ids: number[]) {
		/**
		 * Gets requested users from "users" table
		 * @param ids Array of requested user ids
		 * @returns {object} Queried users
		 */
		const users = await db("users").select("*").whereIn("user_id", ids);
		return users;
	}

	async getUser(id: number) {
		/**
		 * Returns a single User instance
		 * @param id user_id number
		 * @returns {object} Queried user
		 */
		return await db("users").select("*").where({ user_id: id }).first();
	}
}

export default new UserDAO();
