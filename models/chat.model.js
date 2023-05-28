const mongoose = require("mongoose");
const userChat = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.ObjectId,
			ref: "user",
		},
		receiverId: {
			type: mongoose.Schema.ObjectId,
			ref: "user",
		},
		message: {
			type: String,
		},
	},
	{ timestamps: true }
);
module.exports = mongoose.model("chat", userChat);
