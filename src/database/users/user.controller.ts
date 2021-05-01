import { ApolloError } from "apollo-server-errors";
import { Request, Response } from "express";
import ProfileService from "../profiles/profile.service";
import UserService from "./user.service";

class UserController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async loginUser(req: Request, res: Response) {
		return res.send(await UserService.loginUser(req.body));
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
