import db from "../db";

class ChatRoomDAO {
	/**
	 * Access data primarily relating to the "chat_rooms" table
	 */

	async createChatRoom(profileUsernames: string[], privateChat?: boolean) {
		// 1a. Create a new chat room
		const chatRoom = (
			await db("chat_rooms")
				.insert({ private: Boolean(privateChat) })
				.returning("*")
		)[0];

		// 2. Link specified profileIds to that room
		await this.addMembersToChatRoom(chatRoom.room_id, profileUsernames);

		// 3. Return chat room object
		return chatRoom;
	}

	async createPrivateChat(username_1: string, username_2: string) {
		// 0. Check if private chat already exists
		const checkChat = await this.getPrivateChat(username_1, username_2);

		if (checkChat) return new Error("Private chat already exists");

		// 1. Create new chatRoom and get room_id
		const chatRoom = await this.createChatRoom(
			[username_1, username_2],
			true
		);

		// 2. Create new private chat
		const privateChat = (
			await db("private_chats")
				.insert({
					room_id: chatRoom.room_id,
					username_1,
					username_2,
				})
				.returning("*")
		)[0];

		return privateChat;
	}

	async createPublicChat(profileUsernames: string[], name: string) {
		// 1. Create new chatRoom and get room_id
		const chatRoom = await this.createChatRoom(profileUsernames);

		// 2. Create new publicChat using chatRoom
		const publicChat = (
			await db("public_chats")
				.insert({
					room_id: chatRoom.room_id,
					name,
				})
				.returning("*")
		)[0];

		return publicChat;
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
			// 1b. Join "profiles" with "members"
			.join("members", "members.username", "profiles.username")
			.select("profiles.*")
			.where("members.room_id", room_id);

		// 2. Return profile details
		return members;
	}

	async addMembersToChatRoom(room_id: number, profileUsernames: string[]) {
		// 1. Create new profile <---> chat_room connections
		try {
			return (
				await db("members")
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

	async removeMembersFromChatRoom(
		room_id: number,
		profileUsernames: string[]
	) {
		// 1. Delete profile chat_room connections
		await db("members")
			.delete()
			.whereIn("username", profileUsernames)
			.andWhere({ room_id });

		// 2. Return chatRoom
		return await db("chat_rooms").select("*").where({ room_id }).first();
	}

	async getProfileChatRooms(username: string) {
		// Query for chatRooms
		return await db("chat_rooms")
			// Join with ProfileChatRoom table
			.join("members", "members.room_id", "chat_rooms.room_id")
			.select("*")
			.where("members.username", username);
	}

	async getProfileChatRoomIds(username: string) {
		// 1a. Query for chatRooms
		const chatRoomIds = await db("chat_rooms")
			// 1b. Join with ProfileChatRoom table
			.join("members", "members.room_id", "chat_rooms.room_id")
			.select("chat_rooms.room_id")
			.where("members.username", username);

		return chatRoomIds;
	}

	async getPublicChat(room_id: number) {
		// Return group chat by using room_id
		return (await db("public_chats").select("*").where({ room_id }))[0];
	}

	async getPrivateChat(username_1: string, username_2: string) {
		// Return private chat by using usernames
		return (
			await db("private_chats")
				.select("*")
				.where({ username_1, username_2 })
				.orWhere({ username_1: username_2, username_2: username_1 })
		)[0];
	}

	async getPrivateChatById(room_id: number) {
		// Return private chat by using usernames
		return (await db("private_chats").select("*").where({ room_id }))[0];
	}

	async uploadImage(room_id: number, image: string) {
		return (
			await db("public_chats")
				.update({ image })
				.where({ room_id })
				.returning("*")
		)[0];
	}

	async updatePublicChatName(room_id: number, name: string) {
		// 1. Update PublicChat query
		const PublicChat = (
			await db("public_chats")
				.update({ name })
				.where({ room_id })
				.returning("*")
		)[0];

		// 2. return PublicChat
		return PublicChat;
	}
}

export default new ChatRoomDAO();
