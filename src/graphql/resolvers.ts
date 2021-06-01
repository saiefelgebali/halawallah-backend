import UserController from "../database/users/user.controller";
import ProfileController from "../database/profiles/profile.controller";
import PostController from "../database/posts/post.controller";
import CommentController from "../database/comments/comment.controller";
import ChatRoomsController from "../database/chat_rooms/chatRoom.controller";
import MessageController from "../database/messages/message.controller";

const resolvers = {
	Profile: {
		following: ProfileController.getProfileFollowing,
		posts: PostController.getPostsByProfile,
		pfp: (parent: any, args: any, context: any) => {
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
		image: (parent: any, args: any, context: any) => {
			// Handle empty image
			if (!parent.image) {
				return null;
			}
			return `${context.url}/media/img/post/${parent.image}`;
		},
		created_at: (parent: any, args: any, context: any) => {
			// Return timestamp in ISO format as a string
			return new Date(parent.created_at).toISOString();
		},
	},

	Comment: {
		profile: ProfileController.getProfile,
	},

	ChatRoom: {
		members: ChatRoomsController.getChatRoomMembers,
		group: ChatRoomsController.getGroupChat,
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
		getChatRoomById: ChatRoomsController.getChatRoom,
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
		createChatRoom: ChatRoomsController.createChatRoom,
		addMembersToChatRoom: ChatRoomsController.addMembersToChatRoom,
		updateGroupChatName: ChatRoomsController.updateGroupChatName,
		createMessage: MessageController.createMessage,
		deleteMessage: MessageController.deleteMessage,
	},
};

export default resolvers;
