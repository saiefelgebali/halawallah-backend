import MessageDao from "./message.dao";

class MessageService {
	/**
	 * Service layer for messages
	 */

	createMessage(username: string, room_id: number, text: string) {
		return MessageDao.createMessage(username, room_id, text);
	}

	getChatRoomMessages(room_id: number, offset: number, limit: number) {
		return MessageDao.getChatRoomMessages(room_id, offset, limit);
	}

	deleteMessage(message_id: number, username: string) {
		return MessageDao.deleteMessage(message_id, username);
	}
}

export default new MessageService();
