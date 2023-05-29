const User = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = require("../config/secretkey.config");
const Chat = require("../models/chat.model");
const mongoose = require('mongoose');
exports.signup = async (req, res) => {
	console.log("req body", req.body);
	const userObj = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		password: bcrypt.hashSync(req.body.password, 8),
		country: req.body.country,
		image: req.file.filename,
	};
	try {
		const user = await User.create(userObj);
		res.render("pages-login");
	} catch (error) {
		console.log(error.message);
		res
			.status(404)
			.send({ msg: "Something went wrong while creating new user" });
	}
};
exports.signin = async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		let otheruser = await User.find({ email: { $nin: [user.email] } });
		if (!user) {
			return res.status(201).send({
				msg: "User does not exist",
			});
		}
		const isValidPassword = bcrypt.compareSync(
			req.body.password,
			user.password
		);
		if (!isValidPassword) {
			return res.status(201).send({ msg: "Password does not match" });
		}
		const token = jwt.sign({ _id: user }, process.env.SECRET_KEY);
		const response = {
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			location: req.body.location,
			token: token,
		};
		res.render("chat", {
			message: "user created successfully",
			user: user,
			other: otheruser,
		});
	} catch (error) {
		console.log(error.message);
		res.status(404).send({
			msg: "Something went wrong while fetching user",
		});
	}
};
exports.savechat = async (req, res) => {
	// console.log("req body", req.body);
	var chatObj = {
		senderId: req.body.senderId,
		receiverId: req.body.receiverId,
		message: req.body.message,
	};
	try {
		// const exist = await Chat.findOne({
		// 	member: { $all: [senderId, receiverId] },
		// });
		// if (exist) {
		// 	res.status(200).send({ msg: "Conversation already exist" });
		// } else {
		const chat = await Chat.create(chatObj);
		// console.log(chat)
		res.status(201).send({
			success: true,
			msg: "Chat created successfully",
			chat: chat,
		});
		// }
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ success: false, msg: error.message });
	}
};
exports.getUserDetails = async (req, res) => {
	try {
		console.log(req.params.receiverId);
		const user = await User.findOne({ _id: req.params.receiverId });
		const chat = await Chat.find({
			$or: [
			  { receiverId: user._id, senderId: new mongoose.Types.ObjectId(req.body.senderId) }
			]
		  });
		res.status(200).send({ msg: "User fetched successfully", user: user, chat:chat });
	} catch (error) {
		console.log(error.message);
		res
			.status(200)
			.send({ msg: "Something went wrong while fetching new user" });
	}
};
