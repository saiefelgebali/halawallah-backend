import UserController from "../database/users/user.controller";
import ProfileController from "../database/profiles/profile.controller";
import PostController from "../database/posts/post.controller";
import CommentController from "../database/comments/comment.controller";
import ChatRoomsController from "../database/chat_rooms/chatRoom.controller";
import MessageController from "../database/messages/message.controller";
import { pubsub } from "./pubSub";
import { withFilter } from "graphql-subscriptions";
import profileService from "../database/profiles/profile.service";
import chatRoomService from "../database/chat_rooms/chatRoom.service";

const resolvers = {
	Profile: {
		following: ProfileController.getProfileFollowing,
		posts: PostController.getPostsByProfile,
		pfp(parent: any, args: any, context: any) {
			// Handle empty pfp
			if (!parent.pfp) {
				return null;
			}
			return `${context.url}/media/img/pfp/${parent.pfp}`;
		},
		isFollowing: ProfileController.checkFollowing,
	},

	Post: {
		profile: ProfileController.getProfile,
		comments: CommentController.getPostComments,
		image(parent: any, args: any, context: any) {
			// Handle empty image
			if (!parent.image) {
				return null;
			}
			return `${context.url}/media/img/post/${parent.image}`;
		},
		created_at(parent: any, args: any, context: any) {
			// Return timestamp in ISO format as a string
			return new Date(parent.created_at).toISOString();
		},
	},

	Comment: {
		profile: ProfileController.getProfile,
	},

	ChatRoom: {
		members: ChatRoomsController.getChatRoomMembers,
		public: ChatRoomsController.getPublicChat,
		async private(parent: any, args: any, context: any) {
			// Get room data
			const room = await chatRoomService.getPrivateChatById(
				parent.room_id
			);

			if (!room) return null;

			// Find username that isnt context
			const usernames = [room.username_1, room.username_2];
			const otherUsername = usernames.find(
				(u) => u !== context.user.username
			);

			// Return other user profile
			return profileService.getProfile(otherUsername);
		},
		messages: MessageController.getChatRoomMessages,
	},

	Message: {
		room: ChatRoomsController.getChatRoom,
		profile: ProfileController.getProfile,
	},

	// [ROOT QUERY]

	Query: {
		// [PROFILE]
		me: ProfileController.getMyProfile,
		getProfile: ProfileController.getProfile,
		searchProfile: ProfileController.searchProfile,

		// [POST]
		getPostById: PostController.getPostById,
		getPostsByProfile: PostController.getPostsByProfile,
		getCommentsByPost: CommentController.getPostComments,
		feed: PostController.getMyFeed,

		// [CHAT]
		async getChatRoom(parent: any, args: any, context: any) {
			// Return private chat room if username is passed
			if (args.username) {
				return await ChatRoomsController.getPrivateChat(
					parent,
					args,
					context
				);
			}
			return ChatRoomsController.getChatRoom(parent, args);
		},
		getProfileChatRooms: ChatRoomsController.getProfileChatRooms,
		getChatRoomMessages: MessageController.getChatRoomMessages,
	},

	// [ROOT MUTATION]

	Mutation: {
		// [PROFILE]
		createUser: UserController.createUser,
		updateProfile: ProfileController.updateProfile,
		follow: ProfileController.followProfile,
		login: UserController.loginUser,
		logout: UserController.logoutUser,

		// [POST]
		updatePost: PostController.updatePostById,
		deletePost: PostController.deletePostById,
		createComment: CommentController.createComment,
		deleteComment: CommentController.deleteCommentById,

		// [CHAT]
		createPublicChat: ChatRoomsController.createPublicChat,
		createPrivateChat: ChatRoomsController.createPrivateChat,
		addMembersToChatRoom: ChatRoomsController.addMembersToChatRoom,
		updatePublicChatName: ChatRoomsController.updatePublicChatName,
		createMessage: async (parent: any, args: any, context: any) => {
			const message = await MessageController.createMessage(
				parent,
				args,
				context
			);

			// Publish subcription event
			pubsub.publish("MESSAGE_CREATED", { messageCreated: message });

			// Publish event, stopped typing
			const { username, room_id } = message;
			const messageTyping = {
				room_id,
				username,
				isTyping: false,
			};

			pubsub.publish("MESSAGE_TYPING", { messageTyping });

			return message;
		},
		deleteMessage: MessageController.deleteMessage,
		startTyping: (parent: any, args: any, context: any) => {
			// Get relevant info
			const username = context.user.username;
			const room_id = args.room_id;

			const messageTyping = {
				room_id,
				username,
				isTyping: true,
			};

			// Publish subcription event
			pubsub.publish("MESSAGE_TYPING", { messageTyping });

			return !!messageTyping;
		},
		stopTyping: (parent: any, args: any, context: any) => {
			// Get relevant info
			const username = context.user.username;
			const room_id = args.room_id;

			const messageTyping = {
				room_id,
				username,
				isTyping: false,
			};

			// Publish subcription event
			pubsub.publish("MESSAGE_TYPING", { messageTyping });

			return !!messageTyping;
		},
	},

	// [ROOT SUBSCRIPTIONS]
	Subscription: {
		messageCreated: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(["MESSAGE_CREATED"]),
				(payload, variables) => {
					// Only push an update if the message room_id
					// is the room_id subscribed to
					return variables.rooms.includes(
						payload.messageCreated.room_id
					);
				}
			),
		},
		messageTyping: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(["MESSAGE_TYPING"]),
				(payload, variables) => {
					// Only push an update if the args room_id
					// is the room_id subscribed to
					return payload.messageTyping.room_id === variables.room_id;
				}
			),
		},
	},
};

export default resolvers;
