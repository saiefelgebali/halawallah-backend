import { ApolloError } from "apollo-server-errors";
import profileService from "../profiles/profile.service";
import MessageService from "./message.service";

const unauthMessage = new ApolloError("Unauthorized Access");

class MessageController {
	/**
	 * Apollo GraphQL controller for messages
	 */

	async createMessage(parent: any, args: any, context: any) {
		// 0. Authorize request
		if (!context?.user?.id) return unauthMessage;

		// 1. Get context profile
		const profileId = await profileService.getProfileIDFromUserID(
			context.user.id
		);

		// 2. Make request to db
		const message = await MessageService.createMessage(
			profileId,
			args.room_id,
			args.text
		);

		// 3. Return new message
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
		// 0. Authorize request
		if (!context?.user?.id) return unauthMessage;

		// 1. Get context profile
		const profileId = await profileService.getProfileIDFromUserID(
			context.user.id
		);

		// 2. Return boolean if delete success
		return await MessageService.deleteMessage(args.message_id, profileId);
	}
}

export default new MessageController();
