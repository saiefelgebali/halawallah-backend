import RefreshTokenDAO from "./refresh_token.dao";

class RefreshTokenService {
	async createRefreshToken(token: string, user_id: number) {
		return RefreshTokenDAO.createRefreshToken(token, user_id);
	}

	getTokenUserID(token: string) {
		return RefreshTokenDAO.getTokenUserID(token);
	}
}

export default new RefreshTokenService();
