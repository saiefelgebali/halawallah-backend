import UserDAO from "./user.dao";

interface CreateUserArgs {
	username: string;
	password: string;
	admin?: boolean;
}

class UserService {
	/**
	 * Service layer for the User model.
	 * Handles data connecting between the Controller and the Data Access Object (DAO)
	 * Handles potential errors
	 */

	loginUser(credentials: { username: string; password: string }) {
		const { username, password } = credentials;
		return UserDAO.loginUser(username, password);
	}

	createUser(args: CreateUserArgs) {
		const { username, password, admin } = args;
		return UserDAO.createUser(username, password, admin);
	}

	getUser(id: number) {
		return UserDAO.getUser(id);
	}
}

export default new UserService();
