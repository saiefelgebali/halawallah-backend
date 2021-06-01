import { Server } from "socket.io";
import { verifyAccessToken } from "../auth/tokens";
import SocketIO from "socket.io";
import chatRoomService from "../database/chat_rooms/chatRoom.service";
import messageService from "../database/messages/message.service";

interface AuthSocket extends SocketIO.Socket {
	user?: {
		username: string;
		chatRoomIds: string[];
	};
}

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event

function setupChatApp(io: Server) {
	// Socket.io ChatApp

	// Setup middleware to handle authentication
	io.use(async (socket: AuthSocket, next) => {
		// Extract user accessToken
		const accessToken = socket.handshake.auth.accessToken;

		// Validate accessToken
		const user = await verifyAccessToken(accessToken);

		if (user) {
			// Get socket username
			const username = user.username;

			// Get socket rooms and convert integer room_id to strings
			const chatRoomIds = (
				await chatRoomService.getProfileChatRoomIds(user.username)
			).map((room) => room.room_id.toString());

			// Join user to relevant rooms
			socket.join(chatRoomIds);

			// Set socket user if authenticated
			socket.user = { username, chatRoomIds };

			console.log(`${socket.user.username} connected via WebSocket`);

			next();
		} else {
			// Return connection_error if unauth
			next(new Error("Could not authenticate request"));
		}
	});

	io.on("connection", (socket: AuthSocket) => {
		if (!socket.user) return;

		// Welcome socket send id and username
		socket.emit("welcome", {
			username: socket.user.username,
			rooms: socket.user.chatRoomIds,
		});

		// Send messages to room on receive message
		socket.on(NEW_CHAT_MESSAGE_EVENT, async (message) => {
			// Add message to db
			const newMessage = await messageService.createMessage(
				message.username,
				message.room_id,
				message.text
			);

			socket.to(message.room_id).emit(NEW_CHAT_MESSAGE_EVENT, newMessage);
		});
	});
}

export default setupChatApp;
