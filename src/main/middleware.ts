import { ConsoleColor, print } from "alamanah-express";
import { RequestHandler } from "express";
import authentication from "../auth/middleware";

// Log HTTP Requests
const logger: RequestHandler = (req, res, next) => {
	print(
		`${req.protocol}://${req.hostname}${req.url}`,
		req.method,
		ConsoleColor.FgBlue
	);
	next();
};

export default [authentication, logger];
