import { ApolloError } from "apollo-server-errors";
import { Request, Response } from "express";
import ProfileService from "../profiles/profile.service";
import RefreshTokenService from "../refresh_tokens/refresh_token.service";
import UserService from "./user.service";

class UserController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async loginUser(parent: any, args: any, context: any) {
		// Return new refreshToken & an accessToken
		return await UserService.loginUser(args);
	}

	async logoutUser(parent: any, args: any, context: any) {
		// Delete refreshToken associated with login
		// Returns 1 or 0 depending on whether or not is successful
		return await RefreshTokenService.deleteRefreshToken(args.token);
	}

	async getUserById(parent: any, args: any) {
		return await UserService.getUser(args.user_id);
	}

	async createUser(parent: any, args: any) {
		const user = await UserService.createUser(args);

		// User was created successfully
		if (user.user_id) {
			// Create a new profile automatically linked to new user
			const profile = await ProfileService.createProfile(user);
			return profile;
		}

		// Check if username unique constraint is violated
		else if (user.constraint === "users_username_unique") {
			return new ApolloError("A user with that username already exists");
		}

		// Server error occured
		else {
			return new ApolloError("Server could not handle request");
		}
	}
}

export default new UserController();
