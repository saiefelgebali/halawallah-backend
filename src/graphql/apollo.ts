import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { Application } from "express";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { getBaseUrl } from "../util/url";
import http from "http";
import { verifyAccessToken } from "../auth/tokens";
import chatRoomService from "../database/chat_rooms/chatRoom.service";

export const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	subscriptions: {
		// Setup middleware to handle authentication
		onConnect: async (connectionParams: any, webSocket) => {
			// Extract user accessToken
			const accessToken = connectionParams?.accessToken;

			// Validate accessToken
			const user = await verifyAccessToken(accessToken);

			if (user) {
				// Get socket username
				const username = user.username;
				return { user: { username } };
			} else {
				// Return unauthenticated error
			}
		},
	},

	// Apply authentication context to graphql requests
	context: ({ req, connection }) => {
		// If client is establishing a 'ws' connection
		if (connection?.context) {
			return connection.context;
		}
		// Block unauthorized users
		if (!req?.user)
			throw new AuthenticationError("You are unauthenticated");

		// Pass user info in context
		return { user: req.user, url: getBaseUrl(req) };
	},
});

export async function connectApolloServer(app: Application) {
	/**
	 * Start a new ApolloServer instance and connect it to application
	 */

	await apolloServer.start();

	// Subscriptions endpoint using 'ws' protocol
	const httpServer = http.createServer(app);

	// Use graphql as middleware to express
	apolloServer.applyMiddleware({ app });

	// Use graphql subscriptions // 'ws' connections
	apolloServer.installSubscriptionHandlers(httpServer);

	return { httpServer, apolloServer };
}
