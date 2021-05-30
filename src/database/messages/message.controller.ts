import { ApolloError } from "apollo-server-errors";
import profileService from "../profiles/profile.service";
import MessageService from "./message.service";

class MessageController {
	/**
	 * Apollo GraphQL controller for messages
	 */

	async createMessage(parent: any, args: any, context: any) {
		// 1. Make request to db
		const message = await MessageService.createMessage(
			context.user.username,
			args.room_id,
			args.text
		);

		// 2. Return new message
		return message;
	}

	async getChatRoomMessages(parent: any, args: any) {
		// Return paginated messages object
		return await MessageService.getChatRoomMessages(
			args.room_id || parent.room_id,
			args.offset,
			args.limit
		);
	}

	async deleteMessage(parent: any, args: any, context: any) {
		// Return boolean if delete success
		return await MessageService.deleteMessage(
			args.message_id,
			context.user.username
		);
	}
}

export default new MessageController();
