import jwt from "jsonwebtoken";
import RefreshTokenController from "../database/refresh_tokens/refresh_token.controller";

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
