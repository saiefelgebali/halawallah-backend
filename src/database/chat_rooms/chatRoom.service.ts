import ChatRoomDAO from "./chatRoom.dao";

class ChatRoomService {
	/**
	 * Service layer for chatRoom database operations
	 */

	createChatRoom(profileIds: number[]) {
		return ChatRoomDAO.createChatRoom(profileIds);
	}

	getChatRoom(room_id: number) {
		return ChatRoomDAO.getChatRoom(room_id);
	}

	getChatRoomMembers(roomId: number) {
		return ChatRoomDAO.getChatMembers(roomId);
	}

	getProfileChatRooms(profile_id: number, offset: number, limit: number) {
		return ChatRoomDAO.getProfileChatRooms(profile_id, offset, limit);
	}

	addMembersToChatRoom(room_id: number, profileIds: number[]) {
		return ChatRoomDAO.addMembersToChatRoom(room_id, profileIds);
	}

	getGroupChat(room_id: number) {
		return ChatRoomDAO.getGroupChat(room_id);
	}

	updateGroupChatName(room_id: number, name: string) {
		return ChatRoomDAO.updateGroupChatName(room_id, name);
	}
}

export default new ChatRoomService();
