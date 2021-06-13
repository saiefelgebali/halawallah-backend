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

	async loginUser(req: Request, res: Response) {
		// Return new refreshToken & an accessToken
		const loginTokens = await UserService.loginUser(req.body);
		return res.json(loginTokens);
	}

	async logoutUser(parent: any, args: any, context: any) {
		// Delete refreshToken associated with login
		// Returns 1 or 0 depending on whether or not is successful
		return await RefreshTokenService.deleteRefreshToken(args.token);
	}

	async getUser(parent: any, args: any) {
		return await UserService.getUser(args.username);
	}

	async createUser(req: Request, res: Response) {
		const user = await UserService.createUser(req.body);

		// User was created successfully
		if (user.username) {
			// Create a new profile automatically linked to new user
			return res.json(await ProfileService.createProfile(user));
		}

		// Check if username unique constraint is violated
		else if (user.constraint === "users_username_unique") {
			return res
				.status(400)
				.json("A user with that username already exists");
		}

		// Server error occured
		else {
			return res
				.status(500)
				.send("Could not handle request, please try again later");
		}
	}
}

export default new UserController();
