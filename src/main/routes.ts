import { route } from "alamanah-express";
import auth from "../auth/routes";
import api from "../api/routes";
import chat_roomsDao from "../database/chat_rooms/chat_rooms.dao";

export default [
	route({
		method: "GET",
		path: "/auth",
		routes: auth,
	}),
	route({
		method: "GET",
		path: "/api",
		routes: api,
	}),

	// test
	route({
		method: "GET",
		path: "/get/:profile_id",
		view: async (req, res) => {
			const { profile_id } = req.params;
			return res.send(
				await chat_roomsDao.getProfileChatRooms(parseInt(profile_id))
			);
		},
	}),
];
