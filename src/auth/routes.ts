import { route } from "alamanah-express";
import RefreshTokenController from "../database/refresh_tokens/refresh_token.controller";
import UserController from "../database/users/user.controller";
import * as views from "./views";

// Route login requests
const loginRoute = route({
	method: "POST",
	path: "/login",
	view: UserController.loginUser,
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

export default [loginRoute, verifyTokenRoute, refreshTokenRoute];
