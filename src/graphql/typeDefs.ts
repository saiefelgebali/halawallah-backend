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
		pfp: String
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

	type LoginTokens {
		refreshToken: String
		accessToken: String
	}

	type Query {
		getUserById(user_id: Int!): User
		getProfileById(profile_id: Int!): Profile
		me: Profile
		feed(offset: Int, limit: Int): PaginatedPosts
	}

	type Mutation {
		login(username: String!, password: String!): LoginTokens
		logout(token: String!): Boolean
		follow(following_id: Int!): Boolean
		createUser(username: String!, password: String!): Profile
		createComment(post_id: Int!, text: String!): Comment
		updateProfile(display: String, bio: String): Profile
		updatePost(post_id: Int!, caption: String!): Post
		deletePost(post_id: Int!): Boolean
		deleteComment(comment_id: Int!): Boolean
	}
`;

export default typeDefs;
