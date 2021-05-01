import jwt from "jsonwebtoken";

export default function authenticateToken(req: any, res: any, next: any) {
	// Extract auth token from request headers
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	// Handle unauthenticated Request
	if (!token) {
		req.user_id = null;
		return next();
	}

	// Handle authenticated Requests
	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET || "KEY",
		// Add relevant user_id to req object if token valid
		(err: any, result: any) => {
			req.user_id = err ? null : result.user_id;
		}
	);

	return next();
}
