import { route } from "alamanah-express";
import RefreshTokenController from "../database/refresh_tokens/refresh_token.controller";
import userController from "../database/users/user.controller";
import * as views from "./views";

// Login
const loginRoute = route({
	method: "POST",
	path: "/login",
	view: userController.loginUser,
});

// Register a new user
const registerRoute = route({
	method: "POST",
	path: "/register",
	view: userController.createUser,
});

// Verify refresh tokens
const verifyTokenRoute = route({
	method: "GET",
	path: "/verify",
	view: views.verifyTokenView,
});

// Get a new refresh token
const refreshTokenRoute = route({
	method: "POST",
	path: "/refresh",
	view: RefreshTokenController.getNewAccessTokenFromRefreshToken,
});

export default [loginRoute, registerRoute, verifyTokenRoute, refreshTokenRoute];
