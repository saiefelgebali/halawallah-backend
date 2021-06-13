import knex, { Knex } from "knex";
import knexConfig from "./config";

// Use Selected Database Configuration
let db: Knex;

// By default, Jest will set NODE_ENV to test when running tests
if (process.env.NODE_ENV === "test") {
	db = knex(knexConfig.test);
}

// Use Development DB
else if (process.env.NODE_ENV === "development") {
	db = knex(knexConfig.development);
}

// Use Production DB
else if (process.env.NODE_ENV === "production") {
	db = knex(knexConfig.production);
}

// Default to development environment
else {
	db = knex(knexConfig.production);
}

export default db;
