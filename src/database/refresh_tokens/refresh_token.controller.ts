import { Request, Response } from "express";
import { generateAccessToken } from "../../auth/tokens";
import RefreshTokenService from "./refresh_token.service";

class RefreshTokenController {
	async createRefreshToken(args: { username: string; token: string }) {
		const { username, token } = args;
		return await RefreshTokenService.createRefreshToken(token, username);
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
		// user contains - username
		const user = await RefreshTokenService.getTokenUser(refreshToken);

		// Handle invalid refresh token
		if (!user) {
			res.statusCode = 400;
			return res.send("Refresh token is expired");
		}

		// Token is valid
		// Send a new access token with user information
		const accessToken = generateAccessToken({
			username: user.username,
		});

		return res.json({ accessToken });
	}
}

export default new RefreshTokenController();
