import path from "path";
import { ConsoleColor, print } from "alamanah-express";
import express, { RequestHandler } from "express";
import authentication from "../auth/middleware";
import { getAbsoluteUrl } from "../util/url";
import cors from "cors";

// Log HTTP Requests
const logger: RequestHandler = (req, res, next) => {
	print(getAbsoluteUrl(req), req.method, ConsoleColor.FgBlue);
	next();
};
console.log(__dirname);
export default [authentication, logger, cors()];
