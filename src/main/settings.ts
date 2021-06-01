import alamanah from "alamanah-express";
import express from "express";
import path from "path";
import routes from "./routes";
import middleware from "./middleware";

// Server Settings
const PORT = 5000;
const ROUTES = routes;
const MIDDLEWARE = middleware;

// Config Object
const settings = {
	port: process.env.PORT ? parseInt(process.env.PORT) || PORT : PORT,
	routes: ROUTES,
	middleware: MIDDLEWARE,
};

// Al Amanah Application
const app = alamanah(settings);

// Serve static files
app.use("/media", express.static(path.join(__dirname, "../../media")));

export default app;
export { settings };
