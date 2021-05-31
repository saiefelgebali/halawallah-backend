import db from "../db";

class ChatRoomDAO {
	/**
	 * Access data primarily relating to the "chat_rooms" table
	 */

	async createChatRoom(profileUsernames: string[]) {
		// 1a. Create a new chat room
		const chatRoom = (
			await db("chat_rooms")
				.insert(db.raw("DEFAULT VALUES"))
				.returning("*")
		)[0];

		// 1b. If more than 2 profiles, link a Group Chat to Chat Room
		if (profileUsernames.length > 2) {
			await this.createGroupChat(chatRoom.room_id);
		}

		// 2. Link specified profileIds to that room
		await this.addMembersToChatRoom(chatRoom.room_id, profileUsernames);

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
		// 1. Query for ChatRoom
		const chatRoom = (
			await db("chat_rooms").where({ room_id }).select("*")
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
				"profile_chat_room.username",
				"profiles.username"
			)
			.select("profiles.*")
			.where("profile_chat_room.room_id", room_id);

		// 2. Return profile details
		return members;
	}

	async addMembersToChatRoom(room_id: number, profileUsernames: string[]) {
		// 1. Create new profile <---> chat_room connections
		try {
			return (
				await db("profile_chat_room")
					.insert(
						profileUsernames.map((username) => ({
							username,
							room_id,
						}))
					)
					.returning("*")
			)[0];
		} catch (error) {
			throw error;
		}
	}

	async getProfileChatRooms(
		username: string,
		offset: number = 0,
		limit: number = 0
	) {
		// 1a. Get Count of all chatRooms relating to profile
		// ~~ bitwise double NOT, used to parse int
		const count = ~~(
			await db("chat_rooms")
				// 1b. Join with ProfileChatRoom table
				.join(
					"profile_chat_room",
					"profile_chat_room.room_id",
					"chat_rooms.room_id"
				)
				.where("profile_chat_room.username", username)
				.count()
		)[0]?.count;

		// 2. Determine hasMore
		const hasMore = offset + limit < count;

		// 3. Query for chatRooms
		const data = await db("chat_rooms")
			// 3b. Join with ProfileChatRoom table
			.join(
				"profile_chat_room",
				"profile_chat_room.room_id",
				"chat_rooms.room_id"
			)
			.select("*")
			.where("profile_chat_room.username", username)
			.offset(offset)
			.limit(limit);

		return { count, hasMore, data };
	}

	async getGroupChat(room_id: number) {
		// Return group chat by using room_id
		return (await db("group_chats").select("*").where({ room_id }))[0];
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
