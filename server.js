const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const ejs = require("ejs");
const socket=require('./config/socket.config')
const Chat = require("./models/chat.model");
const User = require("./models/auth.model");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const dbConfig = require("./config/db.config");
const serverConfig = require("./config/server.config");
// app.use(
// 	session({
// 		secret: process.env.SESSION_SECRET,
// 	})
// );
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
//database setup
mongoose
	.connect(dbConfig.DB_URL)
	.then(() => {
		console.log("database connected successfully");
	})
	.catch((error) => {
		console.log(error.message);
	});

//setup view engine
app.set("view engine", "ejs");
// socket setup



io.on('connection', (socket) => {
	console.log('User connected: ' + socket.id);
  
	socket.on('newChat', (data) => {
		// console.log('New chat message:', data);
		socket.broadcast.emit("loadnewchat", data);
	});
  
	socket.on('disconnect', () => {
	  console.log('User disconnected: ' + socket.id);
	});

});

//showing login page
app.get("/login", function (req, res) {
	res.render("pages-login");
});
//showing register page
app.get("/", (req, res) => {
	res.render("pages-register");
});
//display error page
app.get("/*", (req, res) => {
	res.render("pages-404");
});
require("./routes/auth.routes")(app);
server.listen(serverConfig.PORT, () => {
	console.log("Server is listen on port", serverConfig.PORT);
});
