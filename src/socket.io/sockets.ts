import http from "http";
import { Application } from "express";
import { Server } from "socket.io";
import setupChatApp from "./chat-app";

export default function createSocketServer(app: Application) {
	// Create a new http server instance
	// Extends existing express server
	const httpServer = http.createServer(app);

	// Initialize socket io on httpServer
	const io = new Server(httpServer, {
		cors: {
			origin: [
				"http://localhost:3000",
				"http://192.168.1.111:3000",
				"http://127.0.0.1:3000",
			],
		},
	});

	// Apply socket applications
	setupChatApp(io);

	return httpServer;
}
