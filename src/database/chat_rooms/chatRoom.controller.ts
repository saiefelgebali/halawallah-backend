import { ApolloError } from "apollo-server-express";
import { Request, Response } from "express";
import { processRequestImage } from "../../api/process";
import ChatRoomService from "./chatRoom.service";

class ChatRoomController {
	/**
	 * Apollo GraphQL controller for chatRoom objects
	 */

	async createPublicChat(parent: any, args: any, context: any) {
		// 1. Make request to db - including requesting profile
		const chatRoom = await ChatRoomService.createPublicChat(
			[...new Set([context.user.username, ...args.profileUsernames])],
			args.name
		);

		// 2. Return new chatRoom details
		return chatRoom;
	}

	async createPrivateChat(parent: any, args: any, context: any) {
		// 1. Make request to db - including requesting profile
		const chatRoom = await ChatRoomService.createPrivateChat(
			context.user.username,
			args.username
		);

		// 2. Return new chatRoom details
		return chatRoom;
	}

	async getChatRoom(parent: any, args: any, context: any) {
		// 0. Check if authorized to access chatRoom
		const members = await ChatRoomService.getChatRoomMembers(
			args.room_id || parent.room_id
		);

		const isAuthorized = members
			.map((m) => m.username)
			.includes(context.user.username);

		if (!isAuthorized) {
			return new ApolloError(
				"You are not authorized to access this chat"
			);
		}

		// 1. Query for chatroom
		const chatRoom = await ChatRoomService.getChatRoom(
			args.room_id || parent.room_id
		);

		// 2. Return chatRoom object
		return chatRoom;
	}

	async getChatRoomMembers(parent: any, args: any, context: any) {
		if (!parent?.room_id) return null;

		// 1. Get room_id from parent
		const roomId = parent.room_id;

		// 2. Request members
		const members = await ChatRoomService.getChatRoomMembers(roomId);

		// 3. Return array of profiles
		return members;
	}

	async getProfileChatRooms(parent: any, args: any, context: any) {
		// 1. Make request to db
		const chatRooms = await ChatRoomService.getProfileChatRooms(
			context.user.username
		);

		// 2. Return new paginated chatRoom response
		return chatRooms;
	}

	async addMembersToChatRoom(parent: any, args: any, context: any) {
		// 1. Make update query
		const chatRoom = await ChatRoomService.addMembersToChatRoom(
			args.room_id,
			args.profileUsernames
		);

		// 2. Return chatRoom
		return chatRoom;
	}

	async removeMembersFromChatRoom(parent: any, args: any, context: any) {
		// 1. Make update query
		const chatRoom = await ChatRoomService.removeMembersFromChatRoom(
			args.room_id,
			args.profileUsernames
		);

		console.log(chatRoom);

		// 2. Return chatRoom
		return chatRoom;
	}

	async updatePublicChatName(parent: any, args: any, context: any) {
		// 1. Make update query
		const chatRoom = await ChatRoomService.updatePublicChatName(
			args.room_id,
			args.name
		);

		// 2. Return chatRoom
		return chatRoom;
	}

	async uploadImage(req: Request, res: Response) {
		console.log(req.body);
		try {
			// Process image
			const image = await processRequestImage("public_chat", req);

			// Upload to db
			const result = await ChatRoomService.uploadImage(
				req.body.room_id,
				image
			);

			// Return new profile details in json format
			res.json(result);
		} catch (error) {
			// Internal server error
			res.sendStatus(500).json(error);
		}
	}

	async getPublicChat(parent: any, args: any, context: any) {
		// 1. Query public chat
		const publicChat = ChatRoomService.getPublicChat(parent.room_id);

		// 2. Return group chat
		return publicChat;
	}

	async getPrivateChat(parent: any, args: any, context: any) {
		// 1a. Query private chat
		const privateChat = await ChatRoomService.getPrivateChat(
			context.user.username,
			args.username
		);

		// 1b. If private chat does not exist, make a new one
		if (!privateChat) {
			return await ChatRoomService.createPrivateChat(
				context.user.username,
				args.username
			);
		}

		// 2. Return private chat
		return privateChat;
	}

	async getPrivateChatById(parent: any, args: any, context: any) {
		// 1. Query private chat
		const privateChat = ChatRoomService.getPrivateChatById(
			args.room_id || parent.room_id
		);

		// 2. Return private chat
		return privateChat;
	}
}

export default new ChatRoomController();
