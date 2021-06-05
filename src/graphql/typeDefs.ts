import { gql } from "apollo-server-core";

const typeDefs = gql`
	# [Profile]

	type Profile {
		username: String
		display: String
		bio: String
		pfp: String
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
		public: PublicChat
		private: Profile
		messages(offset: Int, limit: Int): PaginatedMessages
	}

	type PublicChat {
		name: String
		image: String
	}

	type Message {
		message_id: Int
		room: ChatRoom
		username: String
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

	type MessageTyping {
		room_id: Int!
		username: String!
		isTyping: Boolean!
	}

	# [ROOT QUERY]

	type Query {
		# [PROFILE]
		getProfile(username: String!): Profile
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
		getPostsByProfile(
			username: String!
			offset: Int!
			limit: Int!
		): PaginatedPosts
		feed(offset: Int, limit: Int): PaginatedPosts

		# [CHAT]
		getChatRoomById(room_id: Int!): ChatRoom
		getPrivateChatRoom(username: String!): ChatRoom
		getProfileChatRooms: [ChatRoom]
		getChatRoomMessages(
			room_id: Int!
			offset: Int
			limit: Int
		): PaginatedMessages
	}

	# [ROOT MUTATION]

	type Mutation {
		# [PROFILE]
		createUser(username: String!, password: String!): Profile
		updateProfile(display: String, bio: String): Profile
		follow(following_username: String!): Profile
		login(username: String!, password: String!): LoginTokens
		logout(token: String!): Boolean

		# [POST]
		updatePost(post_id: Int!, caption: String!): Post
		deletePost(post_id: Int!): Boolean
		createComment(post_id: Int!, text: String!): Comment
		deleteComment(comment_id: Int!): Boolean

		# [CHAT]
		createPublicChat(profileUsernames: [String]!): ChatRoom
		createPrivateChat(username: String): ChatRoom
		addMembersToChatRoom(
			room_id: Int!
			profileUsernames: [String]!
		): ChatRoom
		updatePublicChatName(room_id: Int!, name: String!): PublicChat
		createMessage(room_id: Int!, text: String!): Message
		deleteMessage(message_id: Int!): Boolean
		startTyping(room_id: Int!): Boolean
		stopTyping(room_id: Int!): Boolean
	}

	# [ROOT SUBSCRIPTION]
	type Subscription {
		messageCreated(rooms: [Int]!): Message
		messageTyping(room_id: Int!): MessageTyping
	}
`;

export default typeDefs;
