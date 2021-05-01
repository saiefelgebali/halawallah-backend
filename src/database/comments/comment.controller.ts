import { ApolloError } from "apollo-server-errors";
import CommentService from "./comment.service";

interface CreateCommentArgs {
	text: string;
	profile_id: number;
	post_id: number;
}

class CommentController {
	/**
	 * Controller layer for database operations.
	 * @returns Queried results
	 */

	async createComment(parent: any, args: CreateCommentArgs, context: any) {
		// Skip unauthorized requests
		if (!context.userId) {
			return new ApolloError("Unauthorized requst");
		}

		// Return new comment
		return await CommentService.createComment(args);
	}

	async getPostComments(parent: any, args: any, context: any) {
		// Skip invalid requests
		if (!parent.post_id) {
			return new ApolloError("Could handle request");
		}

		return await CommentService.getComments({
			post_id: parent.post_id,
			offset: args.offset,
			limit: args.limit,
		});
	}
}

export default new CommentController();
