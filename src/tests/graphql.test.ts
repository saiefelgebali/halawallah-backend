import { gql } from "apollo-server-core";
import { createTestClient } from "apollo-server-testing";
import db from "../database/db";
import { apolloServer } from "../graphql/apollo";
import { truncate } from "./utils";

const CREATE_USER = gql`
	mutation CREATE_USER($username: String!, $password: String!) {
		createUser(username: $username, password: $password) {
			user {
				username
			}
			profile_id
			display
		}
	}
`;

const CREATE_POST = gql`
	mutation CREATE_POST($username: String!, $password: String!) {
		createUser(username: $username, password: $password) {
			user {
				username
			}
			profile_id
			display
		}
	}
`;

const LOGIN = gql`
	mutation LOGIN($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			refreshToken
			accessToken
		}
	}
`;

const { query, mutate } = createTestClient(apolloServer);

beforeAll(async () => {
	// Reset test database
	await truncate();

	// Migrate database
	await db.migrate.latest();
});

describe("Test GraphQL Mutations", () => {
	// Set up credentials for user
	const username = "test_user";
	const password = "test1234";

	describe("User mutations", () => {
		test("Create user mutation", async () => {
			// Create a new user
			const result = await mutate({
				mutation: CREATE_USER,
				variables: {
					username,
					password,
				},
			});

			// Check if user returns correct username
			expect(result.data).toBeTruthy();
			expect(result.data.createUser.user.username).toBe(username);
		});

		test("Login user mutation", async () => {
			// Try to login
			const result = await mutate({
				mutation: LOGIN,
				variables: {
					username,
					password,
				},
			});

			// Check if result contains a refreshToken
			// Check if result contains a accessToken
			expect(result.data.login.refreshToken).toBeTruthy();
			expect(result.data.login.accessToken).toBeTruthy();
		});
	});
});

afterAll(async () => {
	await db.destroy();
});
