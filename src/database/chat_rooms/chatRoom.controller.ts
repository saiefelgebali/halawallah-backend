import profileService from "../profiles/profile.service";
import ChatRoomService from "./chatRoom.service";

class ChatRoomController {
	/**
	 * Apollo GraphQL controller for chatRoom objects
	 */

	async createChatRoom(parent: any, args: any, context: any) {
		// 0. Authorize request
		if (!context?.user?.id) return null;

		// 1. Get context profile
		const profileId = await profileService.getProfileIDFromUserID(
			context.user.id
		);

		// 2. Make request to db - including requesting profile
		const chatRoom = await ChatRoomService.createChatRoom([
			...new Set([profileId, ...args.profileIds]),
		]);

		// 3. Return new chatRoom details
		return chatRoom;
	}

	async getChatRoomMembers(parent: any, args: any, context: any) {
		if (!parent?.room_id) return null;

		// 1. Get room_id from parent
		const roomId = parent.room_id;

		// 2. Request members
		const members = await ChatRoomService.getChatRoomMembers(roomId);

		// 3. Return array of profiles
		return members;
	}
}

export default new ChatRoomController();
