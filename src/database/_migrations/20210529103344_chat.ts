import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return await knex.schema

		.createTable("chat_rooms", (table) => {
			table.increments("room_id");
		})

		.createTable("group_chats", (table) => {
			table
				.integer("room_id")
				.references("room_id")
				.inTable("chat_rooms")
				.onDelete("CASCADE")
				.primary();
			table.string("name");
			table.string("image");
		})

		.createTable("profile_chat_room", (table) => {
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
			table.primary(["profile_id", "room_id"]);
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
		.dropTable("messages")
		.dropTable("profile_chat_room")
		.dropTable("group_chats")
		.dropTable("chat_rooms");
}