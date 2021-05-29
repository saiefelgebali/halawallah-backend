import db from "../db";

class ChatRoomDAO {
	/**
	 * Access data primarily relating to the "chat_rooms" table
	 */

	async createChatRoom(profileIds: number[]) {
		// 1a. Create a new chat room
		const chatRoom = (
			await db("chat_rooms")
				.insert(db.raw("DEFAULT VALUES"))
				.returning("*")
		)[0];

		// 1b. If more than 2 profiles, link a Group Chat to Chat Room
		if (profileIds.length > 2) {
			await this.createGroupChat(chatRoom.room_id);
		}

		// 2. Link specified profileIds to that room
		await this.addMembersToChatRoom(chatRoom.room_id, profileIds);

		// 3. Return chat room object
		return chatRoom;
	}

	async createGroupChat(room_id: number) {
		// 1. Create group chat linked to room
		const groupChat = (
			await db("group_chats").insert({ room_id }).returning("*")
		)[0];

		// 2. Return group chat
		return groupChat;
	}

	async getChatRoom(room_id: number) {
		// 1a. Query for ChatRoom
		const chatRoom = (
			await db("chat_rooms")
				// 1b. Join with GroupChat
				.join(
					"group_chats",
					"chat_rooms.room_id",
					"group_chats.room_id"
				)
				.where("chat_rooms.room_id", room_id)
				.select("*")
		)[0];

		// 2. Return ChatRoom
		return chatRoom;
	}

	async getChatMembers(room_id: number) {
		// 1a. Query "profiles" table
		const members = await db("profiles")
			// 1b. Join "profiles" with "profile_chat_room"
			.join(
				"profile_chat_room",
				"profile_chat_room.profile_id",
				"profiles.profile_id"
			)
			.select("profiles.*")
			.where("profile_chat_room.room_id", room_id);

		// 2. Return profile details
		return members;
	}

	async addMembersToChatRoom(room_id: number, profileIds: number[]) {
		try {
			// 1. Create new profile <---> chat_room connections
			const members = await db("profile_chat_room")
				.insert(
					profileIds.map((id) => ({
						profile_id: id,
						room_id,
					}))
				)
				.returning("*");
		} catch (error) {
			// Unique constraint may be violated
			return error;
		}
	}

	//  TODO: Return a paginated response
	async getProfileChatRooms(profile_id: number) {
		// 1a. Query ChatRooms
		const chatRooms = await db("chat_rooms")
			// 1b. Join with ProfileChatRoom table
			.join(
				"profile_chat_room",
				"profile_chat_room.room_id",
				"chat_rooms.room_id"
			)
			.select("chat_rooms.*")
			.where("profile_chat_room.profile_id", profile_id);

		return chatRooms;
	}

	async updateGroupChatName(room_id: number, name: string) {
		// 1. Update groupChat query
		const groupChat = (
			await db("group_chats")
				.update({ name })
				.where({ room_id })
				.returning("*")
		)[0];

		// 2. return groupChat
		return groupChat;
	}
}

export default new ChatRoomDAO();
