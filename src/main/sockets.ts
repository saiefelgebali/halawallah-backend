import { Application } from "express";
import { Server } from "socket.io";
import http from "http";

export default function createSocketServer(app: Application) {
	// Create a new http server instance
	// Extends existing express server
	const httpServer = http.createServer(app);

	// Initialize socket io on httpServer
	const io = new Server(httpServer, {
		cors: {
			origin: "*",
		},
	});

	// Apply socket applications
	io.on("connection", (socket) => {
		io.emit("welcome", socket.id);
	});

	return httpServer;
}
