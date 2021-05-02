import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthUser {
	id: number;
	username: string;
}

declare global {
	namespace Express {
		interface Request {
			// Extend express requests by adding a user property
			// User will be determined by auth method
			user?: AuthUser;
		}
	}
}

export default function authenticateToken(
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
	let user: { user_id: number; username: string } | undefined;
	try {
		user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "KEY") as {
			user_id: number;
			username: string;
		};
	} catch {
		user = undefined;
	}

	// Check if user is authorized
	// Apply user details to req object
	if (user && user.user_id) {
		req.user = {
			id: user.user_id,
			username: user.username,
		};
	}

	// Unauthorized user will have undefined req.user object
	else {
		req.user = undefined;
	}

	return next();
}
