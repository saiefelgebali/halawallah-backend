import { route } from "alamanah-express";
import auth from "../auth/routes";
import api from "../api/routes";

export default [
	route({
		method: "GET",
		path: "/auth",
		routes: auth,
	}),
	route({
		method: "GET",
		path: "/api",
		routes: api,
	}),
];
