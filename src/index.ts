import { print, ConsoleColor } from "alamanah-express";
import app, { settings } from "./main/settings";
import { connectApolloServer } from "./graphql/apollo";
import createSocketServer from "./socket.io/sockets";
import { Application } from "express";

async function run(app: Application) {
	// Connect graphql server
	const graphql = await connectApolloServer(app);

	// Connect to socketio server
	// Accept websocket connections
	const server = createSocketServer(app);

	// Start Al Amanah server
	server.listen(settings.port, () => {
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
