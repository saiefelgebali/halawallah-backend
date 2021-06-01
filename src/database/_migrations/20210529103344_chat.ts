import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return await knex.schema

		.createTable("chat_rooms", (table) => {
			table.increments("room_id");
			table.timestamps(true, true);
		})

		.createTable("group_chats", (table) => {
			table
				.integer("room_id")
				.references("room_id")
				.inTable("chat_rooms")
				.onDelete("CASCADE")
				.primary();
			table.string("name").defaultTo("New Group Chat");
			table.string("image");
			table.timestamps(true, true);
		})

		.createTable("profile_chat_room", (table) => {
			table
				.string("username")
				.references("username")
				.inTable("profiles")
				.onDelete("CASCADE");
			table
				.integer("room_id")
				.references("room_id")
				.inTable("chat_rooms")
				.onDelete("CASCADE");
			table.primary(["username", "room_id"]);
			table.timestamps(true, true);
		})

		.createTable("messages", (table) => {
			table.increments("message_id");
			table.text("text");
			table
				.string("username")
				.references("username")
				.inTable("profiles")
				.onDelete("CASCADE");
			table
				.integer("room_id")
				.references("room_id")
				.inTable("chat_rooms")
				.onDelete("CASCADE");
			table.timestamps(true, true);
		});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema
		.dropTable("messages")
		.dropTable("profile_chat_room")
		.dropTable("group_chats")
		.dropTable("chat_rooms");
}
