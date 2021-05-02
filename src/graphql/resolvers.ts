import UserService from "../database/users/user.service";
import UserController from "../database/users/user.controller";
import ProfileController from "../database/profiles/profile.controller";
import PostController from "../database/posts/post.controller";
import CommentController from "../database/comments/comment.controller";

const resolvers = {
	Profile: {
		user: (parent: any, args: any) => {
			return UserService.getUser(parent.user_id);
		},
		following: ProfileController.getProfileFollowingById,
		posts: PostController.getPostsByProfile,
	},

	Post: {
		profile: ProfileController.getProfileById,
		comments: CommentController.getPostComments,
	},

	Comment: {
		profile: ProfileController.getProfileById,
	},

	Query: {
		getUserById: UserController.getUserById,
		getProfileById: ProfileController.getProfileById,
		me: ProfileController.getMyProfile,
		feed: PostController.getMyFeed,
	},

	Mutation: {
		createUser: UserController.createUser,
		createComment: CommentController.createComment,
		follow: ProfileController.followProfile,
		deletePost: PostController.deletePostById,
		deleteComment: CommentController.deleteCommentById,
	},
};

export default resolvers;
