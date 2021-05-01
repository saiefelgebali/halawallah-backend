import knex, { Knex } from "knex";
import knexConfig from "./config";

// Use Selected Database Configuration
let db: Knex;

// By default, Jest will set NODE_ENV to test when running tests
if (process.env.NODE_ENV) {
	db = knex(knexConfig.test);
}

// If not testing, assume development environment
else {
	db = knex(knexConfig.development);
}

export default db;
