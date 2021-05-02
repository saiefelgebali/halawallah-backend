import { Request, Response } from "express";
import { generateAccessToken } from "../../auth/tokens";
import RefreshTokenService from "./refresh_token.service";

class RefreshTokenController {
	async createRefreshToken(args: { user_id: number; token: string }) {
		const { user_id, token } = args;
		return await RefreshTokenService.createRefreshToken(token, user_id);
	}

	async getNewAccessTokenFromRefreshToken(req: Request, res: Response) {
		// Try to access provided refresh token
		const refreshToken = req.body.refreshToken;

		// Handle undefined token
		if (!refreshToken) {
			res.statusCode = 400;
			return res.send(
				"Refresh token was not provided in the request body"
			);
		}

		// Try to get user information from refreshToken
		// user contains - username, user_id
		const user = await RefreshTokenService.getTokenUser(refreshToken);

		// Handle invalid refresh token
		if (!user) {
			res.statusCode = 400;
			return res.send("Refresh token is expired");
		}

		// Token is valid
		// Send a new access token with user information
		const accessToken = generateAccessToken(user);

		return res.json({ accessToken });
	}
}

export default new RefreshTokenController();
