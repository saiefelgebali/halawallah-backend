import { ConsoleColor, print } from "alamanah-express";
import { RequestHandler } from "express";
import authentication from "../auth/middleware";
import { getAbsoluteUrl } from "../util/url";
import cors from "cors";

// Log HTTP Requests in development
const logger: RequestHandler = (req, res, next) => {
	if (process.env.NODE_ENV === "development") {
		print(getAbsoluteUrl(req), req.method, ConsoleColor.FgBlue);
	}
	next();
};

export default [authentication, logger, cors()];
