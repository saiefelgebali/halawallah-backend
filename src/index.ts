import { print, ConsoleColor } from "alamanah-express";
import app, { settings } from "./main/settings";
import { Application } from "express";
import { connectApolloServer } from "./graphql/apollo";

async function run(app: Application) {
	// Connect graphql server
	// use new httpServer endpoint
	// handle 'http' as well as 'ws' connections
	const { httpServer, apolloServer } = await connectApolloServer(app);

	// Start Al Amanah server
	httpServer.listen(settings.port, () => {
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
			`http://localhost:${settings.port}${apolloServer.graphqlPath}`,
			tag,
			ConsoleColor.FgGreen
		);
	});
}

run(app);
