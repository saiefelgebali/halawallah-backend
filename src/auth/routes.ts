import { route } from "alamanah-express";
import RefreshTokenController from "../database/refresh_tokens/refresh_token.controller";
import * as views from "./views";

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

export default [verifyTokenRoute, refreshTokenRoute];
