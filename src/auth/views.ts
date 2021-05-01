import { Request, Response } from "express";

// Handle verifying tokens
export const verifyTokenView = (req: Request, res: Response) => {
	// Return status 200 for a valid access token
	// Return 400 for an invalid token
	//@ts-ignore
	if (req.user_id) {
		return res.sendStatus(200);
	} else {
		//@ts-ignore
		console.log(req.user_id);
		return res.sendStatus(400);
	}
};
