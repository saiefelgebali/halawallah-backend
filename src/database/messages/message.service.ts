import MessageDao from "./message.dao";

class MessageService {
	/**
	 * Service layer for messages
	 */

	createMessage(profile_id: number, room_id: number, text: string) {
		return MessageDao.createMessage(profile_id, room_id, text);
	}

	getChatRoomMessages(room_id: number, offset: number, limit: number) {
		return MessageDao.getChatRoomMessages(room_id, offset, limit);
	}

	deleteMessage(message_id: number, profile_id: number) {
		return MessageDao.deleteMessage(message_id, profile_id);
	}
}

export default new MessageService();
