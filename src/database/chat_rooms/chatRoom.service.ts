import ChatRoomDAO from "./chatRoom.dao";

class ChatRoomService {
	/**
	 * Service layer for chatRoom database operations
	 */

	createChatRoom(profileUsernames: string[]) {
		return ChatRoomDAO.createChatRoom(profileUsernames);
	}

	getChatRoom(room_id: number) {
		return ChatRoomDAO.getChatRoom(room_id);
	}

	getChatRoomMembers(roomId: number) {
		return ChatRoomDAO.getChatMembers(roomId);
	}

	getProfileChatRooms(username: string, offset: number, limit: number) {
		return ChatRoomDAO.getProfileChatRooms(username, offset, limit);
	}

	addMembersToChatRoom(room_id: number, profileUsernames: string[]) {
		return ChatRoomDAO.addMembersToChatRoom(room_id, profileUsernames);
	}

	getGroupChat(room_id: number) {
		return ChatRoomDAO.getGroupChat(room_id);
	}

	updateGroupChatName(room_id: number, name: string) {
		return ChatRoomDAO.updateGroupChatName(room_id, name);
	}
}

export default new ChatRoomService();
