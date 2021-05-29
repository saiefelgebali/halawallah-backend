import db from "../db";

class MesssageDAO {
	/**
	 * Access data primarily relating to the "messages" table
	 */

	async createMessage(profile_id: number, room_id: number, text: string) {
		// 1. Insert values into "messages"
		const message = (
			await db("messages")
				.insert({
					profile_id,
					room_id,
					text,
				})
				.returning("*")
		)[0];

		// 2. Return message
		return message;
	}

	async deleteMessage(message_id: number) {
		// Delete message by its message_id
		// Return a boolean - true for success
		return !(await db("messages").delete().where({ message_id }));
	}

	async getChatRoomMessages(
		room_id: number,
		offset: number = 0,
		limit: number = 0
	) {
		// 1. Get Count of all messages in chatRoom
		// ~~ bitwise double NOT, used to parse int
		const count = ~~(
			await db("messages")
				.count("message_id")
				.where({ room_id })
				.groupBy("room_id")
		)[0]?.count;

		// 2. Determine hasMore
		const hasMore = offset + limit < count;

		// 3. Query for requested messages
		const data = await db("messages")
			.select("*")
			.where({ room_id })
			.offset(offset)
			.limit(limit);

		// 4. Return paginated response object
		return { count, hasMore, data };
	}
}

export default new MesssageDAO();
