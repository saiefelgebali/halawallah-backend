import { ApolloError } from "apollo-server-errors";
import ChatRoomService from "./chatRoom.service";

const unauthMessage = new ApolloError("Unauthorized Access");

class ChatRoomController {
	/**
	 * Apollo GraphQL controller for chatRoom objects
	 */

	async createChatRoom(parent: any, args: any, context: any) {
		// 1. Make request to db - including requesting profile
		const chatRoom = await ChatRoomService.createChatRoom([
			...new Set([context.user.username, ...args.profileUsernames]),
		]);

		// 2. Return new chatRoom details
		return chatRoom;
	}

	async getChatRoom(parent: any, args: any) {
		// 1. Query for chatroom
		const chatRoom = await ChatRoomService.getChatRoom(
			args.room_id || parent.room_id
		);

		// 2. Return chatRoom object
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

	async getProfileChatRooms(parent: any, args: any, context: any) {
		// 1. Make request to db
		const chatRooms = await ChatRoomService.getProfileChatRooms(
			context.user.username
		);

		// 2. Return new paginated chatRoom response
		return chatRooms;
	}

	async addMembersToChatRoom(parent: any, args: any, context: any) {
		// 1. Make update query
		const chatRoom = await ChatRoomService.addMembersToChatRoom(
			args.room_id,
			args.profileUsernames
		);

		// 2. Return chatRoom
		return chatRoom;
	}

	async updateGroupChatName(parent: any, args: any, context: any) {
		// 1. Make update query
		const chatRoom = await ChatRoomService.updateGroupChatName(
			args.room_id,
			args.name
		);

		// 2. Return chatRoom
		return chatRoom;
	}

	async getGroupChat(parent: any, args: any, context: any) {
		// 1. Query group chat
		const groupChat = ChatRoomService.getGroupChat(parent.room_id);

		// 2. Return group chat
		return groupChat;
	}
}

export default new ChatRoomController();
