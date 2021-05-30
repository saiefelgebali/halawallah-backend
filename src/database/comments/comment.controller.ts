import { ApolloError } from "apollo-server-errors";
import CommentService from "./comment.service";

interface CreateCommentArgs {
	text: string;
	username: string;
	post_id: number;
}

class CommentController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async createComment(parent: any, args: CreateCommentArgs, context: any) {
		// Return new comment
		return await CommentService.createComment({
			post_id: args.post_id,
			username: context.user.username,
			text: args.text,
		});
	}

	async getPostComments(parent: any, args: any, context: any) {
		// Send post by args
		if (args && args.post_id) {
			return await CommentService.getComments({
				post_id: args.post_id,
				offset: args.offset,
				limit: args.limit,
			});
		}

		// Send post by parent
		return await CommentService.getComments({
			post_id: parent.post_id,
			offset: args.offset,
			limit: args.limit,
		});
	}

	async deleteCommentById(parent: any, args: any, context: any) {
		// Get comment by id
		const comment = await CommentService.getCommentById(args.comment_id);

		// Ensure post exists
		if (!comment) {
			return new ApolloError("Comment does not exist");
		}

		// Ensure context user matches comment profile
		if (comment.username === context.user.username) {
			return await CommentService.deleteCommentById(comment.comment_id);
		}

		// Handle error
		else {
			return new ApolloError("Unauthorized to delete comment");
		}
	}
}

export default new CommentController();
