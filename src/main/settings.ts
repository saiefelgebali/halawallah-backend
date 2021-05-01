import alamanah from "alamanah-express";
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

export default app;
export { settings };
