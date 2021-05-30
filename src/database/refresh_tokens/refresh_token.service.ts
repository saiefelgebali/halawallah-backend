import RefreshTokenDAO from "./refresh_token.dao";

class RefreshTokenService {
	createRefreshToken(token: string, username: string) {
		return RefreshTokenDAO.createRefreshToken(token, username);
	}

	deleteRefreshToken(token: string) {
		return RefreshTokenDAO.deleteRefreshToken(token);
	}

	getTokenUser(token: string) {
		return RefreshTokenDAO.getTokenUser(token);
	}
}

export default new RefreshTokenService();
