import { ApolloError } from "apollo-server-errors";
import ProfileService from "../profiles/profile.service";
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
		if (!context.user) {
			return new ApolloError("Unauthenticated requst");
		}

		// Get profile id
		const profile_id = await ProfileService.getProfileIDFromUserID(
			context.user.id
		);

		// Return new comment
		return await CommentService.createComment({
			post_id: args.post_id,
			profile_id,
			text: args.text,
		});
	}

	async getPostComments(parent: any, args: any, context: any) {
		// Skip invalid requests
		if (!parent.post_id) {
			return new ApolloError("Could not handle request");
		}

		return await CommentService.getComments({
			post_id: parent.post_id,
			offset: args.offset,
			limit: args.limit,
		});
	}

	async deleteCommentById(parent: any, args: any, context: any) {
		// Try to access user from context
		const user = context.user;

		// Unauthenticated request
		if (!user) {
			return new ApolloError("Unauthenticated request");
		}

		// Get profile details
		const profile_id = await ProfileService.getProfileIDFromUserID(
			context.user.id
		);

		// Get comment by id
		const comment = await CommentService.getCommentById(args.comment_id);

		// Ensure post exists
		if (!comment) {
			return new ApolloError("Comment does not exist");
		}

		console.log(comment);
		console.log(profile_id);

		// Ensure context user matches comment profile
		if (comment.profile_id === profile_id) {
			const result = await CommentService.deleteCommentById(
				comment.comment_id
			);
			return result;
		}

		// Handle error
		else {
			return new ApolloError("Unauthorized to delete comment");
		}
	}
}

export default new CommentController();
