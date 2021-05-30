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
			origin: ["http://localhost:5500"],
		},
	});

	// Apply socket applications
	setupChatApp(io);

	return httpServer;
}
