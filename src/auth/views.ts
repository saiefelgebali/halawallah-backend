import { Request, Response } from "express";

// Handle verifying tokens
export const verifyTokenView = (req: Request, res: Response) => {
	// Return status 200 for a valid access token
	if (req.user && req.user.username) {
		return res.sendStatus(200);
	}

	// Return 400 for an invalid token
	else {
		return res.sendStatus(400);
	}
};
