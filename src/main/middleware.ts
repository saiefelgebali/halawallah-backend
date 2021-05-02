import { ConsoleColor, print } from "alamanah-express";
import { RequestHandler } from "express";
import authentication from "../auth/middleware";
import { getAbsoluteUrl } from "../util/url";

// Log HTTP Requests
const logger: RequestHandler = (req, res, next) => {
	print(getAbsoluteUrl(req), req.method, ConsoleColor.FgBlue);
	next();
};

export default [authentication, logger];
