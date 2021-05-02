import { Request } from "express";

export function getBaseUrl(req: Request) {
	// Return only base of url used to get to server
	return `${req.protocol}://${req.get("host")}`;
}
export function getAbsoluteUrl(req: Request) {
	// Return url used to get to server
	return `${req.protocol}://${req.get("host")}${req.originalUrl}`;
}
