import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return await knex.schema

		.createTable("users", (table) => {
			table.string("username").notNullable().unique();
			table.string("password").notNullable();
			table.boolean("admin").notNullable().defaultTo(false);
			table.timestamps(true, true);
		})

		.createTable("profiles", (table) => {
			table
				.string("username")
				.references("username")
				.inTable("users")
				.onDelete("CASCADE")
				.primary();
			table.string("display");
			table.text("bio");
			table.string("pfp");
			table.timestamps(true, true);
		})

		.createTable("profile_following", (table) => {
			table.increments("id");
			table
				.string("profile_username")
				.references("username")
				.inTable("profiles")
				.onDelete("CASCADE");
			table
				.string("following_username")
				.references("username")
				.inTable("profiles")
				.onDelete("CASCADE");
			table.timestamps(true, true);
		})

		.createTable("posts", (table) => {
			table.increments("post_id");
			table.string("image");
			table.text("caption");
			table
				.string("username")
				.references("username")
				.inTable("profiles")
				.onDelete("CASCADE");
			table.timestamps(true, true);
		})

		.createTable("comments", (table) => {
			table.increments("comment_id");
			table.text("text");
			table
				.string("username")
				.references("username")
				.inTable("profiles")
				.onDelete("CASCADE");
			table
				.integer("post_id")
				.references("post_id")
				.inTable("posts")
				.onDelete("CASCADE");
			table.timestamps(true, true);
		})

		.createTable("refresh_tokens", (table) => {
			table.string("token").notNullable().primary();
			table
				.string("username")
				.references("username")
				.inTable("users")
				.onDelete("CASCADE");
			table.timestamps(true, true);
		})

		.createTable("reports", (table) => {
			table.increments("report_id");
			table.integer("type").defaultTo(0);
			table.text("text");
			table
				.string("username")
				.references("username")
				.inTable("users")
				.onDelete("CASCADE");
			table.timestamps(true, true);
		});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema
		.dropTable("users")
		.dropTable("profiles")
		.dropTable("profile_following")
		.dropTable("posts")
		.dropTable("comments")
		.dropTable("refresh_tokens");
}
