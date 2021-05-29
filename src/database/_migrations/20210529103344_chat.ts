import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return await knex.schema

		.createTable("group_chats", (table) => {
			table.increments("group_id");
			table.string("name");
			table.string("image");
		})

		.createTable("chat_rooms", (table) => {
			table.increments("room_id");
			table
				.integer("group_id")
				.references("group_id")
				.inTable("group_chats")
				.onDelete("CASCADE");
		})

		.createTable("profile_chat_room", (table) => {
			table.increments("id");
			table
				.integer("profile_id")
				.references("profile_id")
				.inTable("profiles")
				.onDelete("CASCADE");
			table
				.integer("room_id")
				.references("room_id")
				.inTable("chat_rooms")
				.onDelete("CASCADE");
		})

		.createTable("messages", (table) => {
			table.increments("message_id");
			table.text("text");
			table
				.integer("profile_id")
				.references("profile_id")
				.inTable("profiles")
				.onDelete("CASCADE");
			table
				.integer("room_id")
				.references("room_id")
				.inTable("chat_rooms")
				.onDelete("CASCADE");
		});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema
		.dropTable("group_chats")
		.dropTable("chat_rooms")
		.dropTable("profile_chat_room")
		.dropTable("messages");
}
