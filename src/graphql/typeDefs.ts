import { gql } from "apollo-server-core";

const typeDefs = gql`
	type User {
		user_id: Int
		username: String
	}

	type Profile {
		profile_id: Int
		display: String
		bio: String
		user: User
		following(offset: Int, limit: Int): PaginatedProfiles
		posts(offset: Int, limit: Int): PaginatedPosts
	}

	type Post {
		image: String
		caption: String
		profile: Profile
	}

	type PaginatedPosts {
		count: Int
		hasMore: Boolean
		data: [Post]
	}

	type PaginatedProfiles {
		count: Int
		hasMore: Boolean
		data: [Profile]
	}

	type Query {
		getUserById(user_id: Int!): User
		getProfileById(profile_id: Int!): Profile
		me: Profile
		feed(offset: Int, limit: Int): PaginatedPosts
	}

	type Mutation {
		createUser(username: String!, password: String!): Profile
		follow(following_id: Int!): Boolean
	}
`;

export default typeDefs;
