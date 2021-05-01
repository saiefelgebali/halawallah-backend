import { print, ConsoleColor } from "alamanah-express";
import app, { settings } from "./main/settings";
import { connectApolloServer } from "./graphql/apollo";
import express, { Application } from "express";

async function run(app: Application) {
	// Serve static files
	app.use(express.static(`${process.cwd()}/media`));

	// Connect graphql server
	const graphql = await connectApolloServer(app);

	// Start Al Amanah server
	app.listen(settings.port, () => {
		// Print out startup details
		const tag = "SERVER";
		console.clear();
		print(
			`Server started on port ${settings.port}`,
			tag,
			ConsoleColor.FgGreen
		);
		print(`http://localhost:${settings.port}`, tag, ConsoleColor.FgGreen);
		print(
			`http://localhost:${settings.port}${graphql.graphqlPath}`,
			tag,
			ConsoleColor.FgGreen
		);
	});
}

run(app);
