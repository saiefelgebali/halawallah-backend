import UserService from "../database/users/user.service";
import UserController from "../database/users/user.controller";
import ProfileController from "../database/profiles/profile.controller";
import PostController from "../database/posts/post.controller";
import CommentController from "../database/comments/comment.controller";
import ChatRoomsController from "../database/chat_rooms/chatRoom.controller";
import MessageController from "../database/messages/message.controller";

const resolvers = {
	Profile: {
		user: (parent: any, args: any) => {
			return UserService.getUser(parent.user_id);
		},
		following: ProfileController.getProfileFollowingById,
		posts: PostController.getPostsByProfile,
		pfp: (parent: any, args: any, context: any) => {
			// Handle empty pfp
			if (!parent.pfp) {
				return null;
			}
			return `${context.url}/api/media/img/pfp/${parent.pfp}`;
		},
		isFollowing: ProfileController.checkFollowing,
	},

	Post: {
		profile: ProfileController.getProfileById,
		comments: CommentController.getPostComments,
		image: (parent: any, args: any, context: any) => {
			// Handle empty image
			if (!parent.image) {
				return null;
			}
			return `${context.url}/api/media/img/post/${parent.image}`;
		},
		created_at: (parent: any, args: any, context: any) => {
			// Return timestamp in ISO format as a string
			return new Date(parent.created_at).toISOString();
		},
	},

	Comment: {
		profile: ProfileController.getProfileById,
	},

	ChatRoom: {
		members: ChatRoomsController.getChatRoomMembers,
		group: ChatRoomsController.getGroupChat,
		messages: MessageController.getChatRoomMessages,
	},

	Message: {
		room: ChatRoomsController.getChatRoom,
		profile: ProfileController.getProfileById,
	},

	// [ROOT QUERY]

	Query: {
		// [PROFILE]
		getUserById: UserController.getUserById,
		getProfileById: ProfileController.getProfileById,
		me: ProfileController.getMyProfile,
		getProfileByUsername: ProfileController.getProfileByUsername,
		searchProfile: ProfileController.searchProfile,

		// [POST]
		getPostById: PostController.getPostsById,
		getPostsByUsername: PostController.getPostsByProfileUsername,
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
