import ChatRoomDAO from "./chatRoom.dao";

class ChatRoomService {
	/**
	 * Service layer for chatRoom database operations
	 */

	createPublicChat(profileUsernames: string[], name: string) {
		return ChatRoomDAO.createPublicChat(profileUsernames, name);
	}

	createPrivateChat(username_1: string, username_2: string) {
		return ChatRoomDAO.createPrivateChat(username_1, username_2);
	}

	getChatRoom(room_id: number) {
		return ChatRoomDAO.getChatRoom(room_id);
	}

	getChatRoomMembers(roomId: number) {
		return ChatRoomDAO.getChatMembers(roomId);
	}

	getProfileChatRooms(username: string) {
		return ChatRoomDAO.getProfileChatRooms(username);
	}

	getProfileChatRoomIds(username: string) {
		return ChatRoomDAO.getProfileChatRoomIds(username);
	}

	addMembersToChatRoom(room_id: number, profileUsernames: string[]) {
		return ChatRoomDAO.addMembersToChatRoom(room_id, profileUsernames);
	}

	removeMembersFromChatRoom(room_id: number, profileUsernames: string[]) {
		return ChatRoomDAO.removeMembersFromChatRoom(room_id, profileUsernames);
	}

	getPublicChat(room_id: number) {
		return ChatRoomDAO.getPublicChat(room_id);
	}

	getPrivateChat(username_1: string, username_2: string) {
		return ChatRoomDAO.getPrivateChat(username_1, username_2);
	}

	getPrivateChatById(room_id: number) {
		return ChatRoomDAO.getPrivateChatById(room_id);
	}

	updatePublicChatName(room_id: number, name: string) {
		return ChatRoomDAO.updatePublicChatName(room_id, name);
	}

	uploadImage(room_id: number, image: string) {
		return ChatRoomDAO.uploadImage(room_id, image);
	}
}

export default new ChatRoomService();
