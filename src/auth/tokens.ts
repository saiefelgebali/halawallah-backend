import jwt from "jsonwebtoken";
import RefreshTokenController from "../database/refresh_tokens/refresh_token.controller";
import AuthUser from "./AuthUser.interface";

export function generateAccessToken(user: { id: number; username: string }) {
	// Sign a new access token with user_id
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET ?? "KEY");
}

export async function generateRefreshToken(user_id: number) {
	// Sign a new refresh token with user_id
	const token = jwt.sign(
		{ user_id },
		process.env.REFRESH_TOKEN_SECRET ?? "KEY"
	);

	// Add new token to database and link to user
	try {
		await RefreshTokenController.createRefreshToken({ token, user_id });
	} catch {
		return new Error("Could not generate refresh token");
	}

	return token;
}

export async function verifyAccessToken(accessToken: string) {
	// Handle authenticated Requests

	try {
		// Try to verify token
		const user = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET || "KEY"
		) as AuthUser;

		// Return user object { id, username }
		return user;
	} catch {
		// User request is not authenticated
		return undefined;
	}
}
