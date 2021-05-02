import { ApolloServer } from "apollo-server-express";
import { Application } from "express";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

export const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,

	// Apply authentication context to graphql requests
	context: ({ req }) => {
		if (req && req.user && req.user.id) {
			return { user: req.user };
		}
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
