import RefreshTokenDAO from "./refresh_token.dao";

class RefreshTokenService {
	createRefreshToken(token: string, user_id: number) {
		return RefreshTokenDAO.createRefreshToken(token, user_id);
	}

	deleteRefreshToken(token: string) {
		return RefreshTokenDAO.deleteRefreshToken(token);
	}

	getTokenUser(token: string) {
		return RefreshTokenDAO.getTokenUser(token);
	}
}

export default new RefreshTokenService();
