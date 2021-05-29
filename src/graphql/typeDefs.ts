import { gql } from "apollo-server-core";

const typeDefs = gql`
	# [Profile]

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
		isFollowing: Boolean
	}

	type PaginatedProfiles {
		count: Int
		hasMore: Boolean
		data: [Profile]
	}

	type LoginTokens {
		refreshToken: String
		accessToken: String
	}

	# [Post]

	type Post {
		post_id: Int
		image: String
		caption: String
		profile: Profile
		comments(offset: Int, limit: Int): PaginatedComments
		created_at: String
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

	type PaginatedComments {
		count: Int
		hasMore: Boolean
		data: [Comment]
	}

	# [CHAT]

	type ChatRoom {
		room_id: Int
		members: [Profile]
		group: GroupChat
		messages(offset: Int, limit: Int): PaginatedMessages
	}

	type GroupChat {
		name: String
		image: String
	}

	type Message {
		message_id: Int
		room: ChatRoom
		profile: Profile
		text: String
	}

	type PaginatedChatRooms {
		count: Int
		hasMore: Boolean
		data: [ChatRoom]
	}

	type PaginatedMessages {
		count: Int
		hasMore: Boolean
		data: [Message]
	}

	# [ROOT QUERY]

	type Query {
		# [PROFILE]
		getUserById(user_id: Int!): User
		getProfileByUsername(username: String!): Profile
		getProfileById(profile_id: Int!): Profile
		me: Profile
		searchProfile(
			query: String!
			offset: Int
			limit: Int
		): PaginatedProfiles

		# [POST]
		getPostById(post_id: Int!): Post
		getCommentsByPost(
			post_id: Int!
			offset: Int
			limit: Int
		): PaginatedComments
		getPostsByUsername(
			username: String!
			offset: Int!
			limit: Int!
		): PaginatedPosts
		feed(offset: Int, limit: Int): PaginatedPosts

		# [CHAT]
		getChatRoomById(room_id: Int!): ChatRoom
		getProfileChatRooms(offset: Int, limit: Int): PaginatedChatRooms
		getChatRoomMessages(offset: Int, limit: Int): PaginatedMessages
	}

	# [ROOT MUTATION]

	type Mutation {
		# [PROFILE]
		createUser(username: String!, password: String!): Profile
		updateProfile(display: String, bio: String): Profile
		follow(following_id: Int!): Profile
		login(username: String!, password: String!): LoginTokens
		logout(token: String!): Boolean

		# [POST]
		updatePost(post_id: Int!, caption: String!): Post
		deletePost(post_id: Int!): Boolean
		createComment(post_id: Int!, text: String!): Comment
		deleteComment(comment_id: Int!): Boolean

		# [CHAT]
		createChatRoom(profileIds: [Int]!): ChatRoom
		addMembersToChatRoom(room_id: Int!, profileIds: [Int]!): ChatRoom
		updateGroupChatName(room_id: Int!, name: String!): GroupChat
		createMessage(room_id: Int!, text: String!): Message
		deleteMessage(message_id: Int!): Boolean
	}
`;

export default typeDefs;
