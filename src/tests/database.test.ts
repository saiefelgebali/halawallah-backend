import commentService from "../database/comments/comment.service";
import db from "../database/db";
import postService from "../database/posts/post.service";
import profileService from "../database/profiles/profile.service";
import refreshTokenService from "../database/refresh_tokens/refresh_token.service";
import userService from "../database/users/user.service";

// Truncate tables
const tables = ["users", "profiles", "posts", "profile_following", "comments"];
async function truncate() {
	tables.forEach(async (table) => {
		await db.raw("TRUNCATE TABLE " + table + " CASCADE");
	});
}

describe("Tet Database Model Services", () => {
	beforeAll(async () => {
		// Clear data from test tables
		await truncate();

		// Run migrations on test database
		await db.migrate.latest();
	});

	// Utility function to create a user
	async function createUser(username: string, password: string) {
		// Return a new user instance
		return await userService.createUser({
			username,
			password,
		});
	}

	// Utility function to create user and linked profile
	async function createProfile(username: string, password: string) {
		// Create a new user instance
		const user = await createUser(username, password);

		// Return a new profile linked to user
		return await profileService.createProfile(user);
	}

	// Utility function to create a new Post
	async function createTestPost(profile: any) {
		return postService.createPost(
			profile.user_id,
			"mock_image",
			"not a caption"
		);
	}

	describe("User Service", () => {
		test("Create user", async () => {
			// Check if creating user returns a user_id
			const user = await createUser("create_test", "test1234");

			expect(user.user_id).not.toBeFalsy();
		});

		test("Get user by ID", async () => {
			// Create a new user
			const newUser = await createUser("get_test", "test1234");

			// Check if getting user by id returns a user_id
			const user = await userService.getUser(newUser.user_id);

			expect(user.user_id).toBeTruthy();
		});

		test("Login user", async () => {
			// Credentials
			const username = "login_test";
			const password = "login_test_password1234";

			// Create a new user
			const newUser = await createUser(username, password);

			// Check if login returns a refresh token
			const user = await userService.loginUser({ username, password });

			expect(user.refreshToken).toBeTruthy();
		});
	});

	describe("Profile Service", () => {
		test("Create profile", async () => {
			const profile = await createProfile(
				"create_profile_test",
				"test1234"
			);

			expect(profile.profile_id).toBeTruthy();
		});

		test("Get profile", async () => {
			// Create new profile
			const profile = await createProfile("get_profile_test", "test1234");

			// Get profile by its id
			const getProfile = await profileService.getProfile(
				profile.profile_id
			);

			// Check if getProfile includes valid profile_id
			expect(getProfile.profile_id).toEqual(profile.profile_id);
		});

		test("Follow profile", async () => {
			// Create 2 new profiles
			const profile1 = await createProfile("follow_test_1", "test1234");
			const profile2 = await createProfile("follow_test_2", "test1234");

			// Have profile1 follow profile2
			const isFollowing = await profileService.followProfile(
				profile1.profile_id,
				profile2.profile_id
			);

			// Check if isFollowing = true
			expect(isFollowing).toBeTruthy();
		});

		test("Get profile following", async () => {
			// Create 2 new profiles
			const profile1 = await createProfile(
				"get_follow_test_1",
				"test1234"
			);
			const profile2 = await createProfile(
				"get_follow_test_2",
				"test1234"
			);

			// Have profile1 follow profile2
			await profileService.followProfile(
				profile1.profile_id,
				profile2.profile_id
			);

			// Get 1st profile following of profile1
			const profileFollowing = await profileService.getProfileFollowing(
				profile1.profile_id,
				0,
				1
			);

			// Ensure paginated meta data is correct
			expect(profileFollowing.count).toBe(1);
			expect(profileFollowing.hasMore).toBe(false);

			// Check if profileFollowing is an array
			expect(Array.isArray(profileFollowing.data)).toBeTruthy();
		});

		test("Get profile_id from user_id", async () => {
			// Create new profile with user
			const profile = await createProfile(
				"get_profile_from_user_test",
				"test1234"
			);

			// Get profile id from user id
			const profileId = await profileService.getProfileIDFromUserID(
				profile.user_id
			);

			// Check if profileId is correct
			expect(profileId).toBe(profile.profile_id);
		});
	});

	describe("Post Service", () => {
		test("Create post", async () => {
			// Creates a new profile
			const profile = await createProfile(
				"create_post_user_test",
				"test1234"
			);

			// Create a new post
			const post = await postService.createPost(
				profile.user_id,
				"test_image",
				"test caption"
			);

			// Check for post_id
			expect(post.post_id).toBeTruthy();
		});

		test("Get profile posts", async () => {
			// Creates a new profile
			const profile = await createProfile(
				"get_profile_posts_user_test",
				"test1234"
			);

			// Create a new post
			const post = await postService.createPost(
				profile.user_id,
				"test_image",
				"test caption"
			);

			// Get list of posts by profile
			const posts = await postService.getPostsByProfile(
				profile.profile_id,
				0,
				1
			);

			// Check pagination meta data
			expect(posts.count).toBe(1);
			expect(posts.hasMore).toBe(false);
			// Check if posts data is an array
			expect(Array.isArray(posts.data)).toBeTruthy();
		});

		test("Get profile feed", async () => {
			// Create 2 new profiles
			const profile1 = await createProfile("feed_profile1", "test1234");
			const profile2 = await createProfile("feed_profile2", "test1234");

			// Have profile2 create a new post
			await postService.createPost(
				profile2.user_id,
				"new_image",
				"Hello!"
			);

			// Have profile1 follow profile2
			await profileService.followProfile(
				profile1.profile_id,
				profile2.profile_id
			);

			// Get profile1's feed
			const feed = await postService.getProfileFeed(
				profile1.profile_id,
				0,
				1
			);

			// Check pagination meta data
			expect(feed.count).toBe(1);
			expect(feed.hasMore).toBe(false);
			expect(Array.isArray(feed.data)).toBeTruthy();
		});
	});

	describe("Comment Service", () => {
		test("Create comment", async () => {
			// Create new post
			const profile = await createProfile(
				"create_comment_profile",
				"test1234"
			);
			const post = await createTestPost(profile);

			// Create comment
			const comment = await commentService.createComment({
				post_id: post.post_id,
				profile_id: profile.profile_id,
				text: "Nice post!",
			});

			// Check if comment_id is valid
			expect(comment.comment_id).toBeTruthy();
		});

		test("Get post comments", async () => {
			// Create new post
			const profile = await createProfile(
				"create_comment_profile",
				"test1234"
			);
			const post = await createTestPost(profile);

			// Create comment
			const comment = await commentService.createComment({
				post_id: post.post_id,
				profile_id: profile.profile_id,
				text: "Nice post!",
			});

			// Get comment from post
			const postComments = await commentService.getComments({
				post_id: post.post_id,
				offset: 0,
				limit: 1,
			});

			// Check pagination meta data
			expect(postComments.count).toBe(1);
			expect(postComments.hasMore).toBe(false);
			// Check if data is an array
			expect(Array.isArray(postComments.data)).toBeTruthy();
		});
	});

	describe("RefreshToken Service", () => {
		test("Create RefreshToken", async () => {
			// Create new user
			const user = await createUser("refresh_test_user", "test1234");

			// Create token
			const refreshToken = await refreshTokenService.createRefreshToken(
				"create_token",
				user.user_id
			);

			// Check if token is valid
			expect(refreshToken.token).toBe(refreshToken.token);
			expect(refreshToken.user_id).toBe(user.user_id);
		});

		test("Get user id from token", async () => {
			// Create a new user
			const user = await createUser("get_token_user_test", "test1234");

			// Create a new token linked to user
			const refreshToken = await refreshTokenService.createRefreshToken(
				"get_user_token",
				user.user_id
			);

			// Get user_id from token
			const userId = await refreshTokenService.getTokenUserID(
				refreshToken.token
			);

			// Check if user_id is correct
			expect(userId).toBe(user.user_id);
		});
	});

	afterAll(async () => {
		// Close connection to database
		await db.destroy();
	});
});
