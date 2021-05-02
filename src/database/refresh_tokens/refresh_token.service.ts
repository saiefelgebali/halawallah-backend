import RefreshTokenDAO from "./refresh_token.dao";

class RefreshTokenService {
	createRefreshToken(token: string, user_id: number) {
		return RefreshTokenDAO.createRefreshToken(token, user_id);
	}

	getTokenUser(token: string) {
		return RefreshTokenDAO.getTokenUser(token);
	}
}

export default new RefreshTokenService();
