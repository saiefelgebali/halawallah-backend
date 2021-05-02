import { ApolloServer } from "apollo-server-express";
import { Application } from "express";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { getBaseUrl } from "../util/url";

export const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,

	// Apply authentication context to graphql requests
	context: ({ req }) => {
		return { user: req.user, url: getBaseUrl(req) };
	},
});

export async function connectApolloServer(app: Application) {
	/**
	 * Start a new ApolloServer instance and connect it to application
	 */

	await apolloServer.start();

	apolloServer.applyMiddleware({ app });

	return apolloServer;
}
