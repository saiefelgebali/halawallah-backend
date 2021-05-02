import db from "../database/db";

// Truncate tables
const tables = ["users", "profiles", "posts", "profile_following", "comments"];
export async function truncate() {
	tables.forEach(async (table) => {
		await db.raw("TRUNCATE TABLE " + table + " CASCADE");
	});
}
