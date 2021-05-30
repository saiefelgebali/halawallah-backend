import { Server } from "socket.io";
import { verifyAccessToken } from "../auth/tokens";
import AuthUser from "../auth/AuthUser.interface";
import SocketIO from "socket.io";

interface AuthSocket extends SocketIO.Socket {
	user?: AuthUser;
}

function setupChatApp(io: Server) {
	// Socket.io ChatApp

	// Setup middleware to handle authentication
	io.use(async (socket: AuthSocket, next) => {
		// Extract user accessToken
		const accessToken = socket.handshake.auth.accessToken;

		// Validate accessToken
		const user = await verifyAccessToken(accessToken);

		if (user) {
			// Set socket user if authenticated
			socket.user = user;
			next();
		} else {
			// Return connection_error if unauth
			next(new Error("Could not authenticate request"));
		}
	});

	io.on("connection", (socket: AuthSocket) => {
		// Welcome socket send id and username
		socket.emit("welcome", {
			username: socket.user?.username,
		});

		socket.on("send-message", (room_id) => {
			console.log(room_id);
		});
	});
}

export default setupChatApp;
