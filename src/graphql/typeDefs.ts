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
		post_id: Int
		image: String
		caption: String
		profile: Profile
		comments(offset: Int, limit: Int): PaginatedComments
	}

	type Comment {
		comment_id: Int
		profile: Profile
		text: String
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

	type PaginatedComments {
		count: Int
		hasMore: Boolean
		data: [Comment]
	}

	type Query {
		getUserById(user_id: Int!): User
		getProfileById(profile_id: Int!): Profile
		me: Profile
		feed(offset: Int, limit: Int): PaginatedPosts
	}

	type Mutation {
		createUser(username: String!, password: String!): Profile
		createComment(post_id: Int!, text: String!): Comment
		follow(following_id: Int!): Boolean
		deletePost(post_id: Int!): Boolean
	}
`;

export default typeDefs;
