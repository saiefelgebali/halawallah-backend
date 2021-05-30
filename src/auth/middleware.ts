import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./tokens";
import AuthUser from "./AuthUser.interface";

declare global {
	namespace Express {
		interface Request {
			// Extend express requests by adding a user property
			// User will be determined by auth method
			user?: AuthUser;
		}
	}
}

export default async function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	// Extract auth token from request headers
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	// Handle unauthenticated Request
	if (!token) {
		req.user = undefined;
		return next();
	}

	// Handle authenticated Requests
	const user = (await verifyAccessToken(token)) as AuthUser;

	// Check if user is authorized
	// Apply user details to req object
	if (user && user.id) {
		req.user = {
			id: user.id,
			username: user.username,
		};
	}

	// Unauthorized user will have undefined req.user object
	else {
		req.user = undefined;
	}

	return next();
}
