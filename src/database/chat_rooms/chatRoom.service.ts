import ChatRoomDAO from "./chatRoom.dao";

class ChatRoomService {
	/**
	 * Service layer for chatRoom database operations
	 */

	createChatRoom(profileIds: number[]) {
		return ChatRoomDAO.createChatRoom(profileIds);
	}

	getChatRoomMembers(roomId: number) {
		return ChatRoomDAO.getChatMembers(roomId);
	}
}

export default new ChatRoomService();
