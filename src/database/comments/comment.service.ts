import CommentDAO from "./comment.dao";

interface CreateCommentArgs {
	text: string;
	profile_id: number;
	post_id: number;
}

interface CommentsPaginatedArgs {
	post_id: number;
	offset: number;
	limit: number;
}

class CommentService {
	/**
	 * Service layer
	 * Handles data connecting between the Controller and the Data Access Object (DAO)
	 */

	createComment(args: CreateCommentArgs) {
		return CommentDAO.createComment(
			args.text,
			args.profile_id,
			args.post_id
		);
	}

	getComments(args: CommentsPaginatedArgs) {
		return CommentDAO.getPostComments(
			args.post_id,
			args.offset,
			args.limit
		);
	}

	getCommentById(comment_id: number) {
		return CommentDAO.getComment(comment_id);
	}

	deleteCommentById(comment_id: number) {
		return CommentDAO.deleteCommentById(comment_id);
	}
}

export default new CommentService();
