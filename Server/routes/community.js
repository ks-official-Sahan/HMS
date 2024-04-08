const jwt = require("jsonwebtoken");
const config = require("config");

const { Message } = require("../models/message");
const auth = require("../middleware/auth");
// const { authToken, socketAdmin, socket_id } = require("../middleware/socketAuth");
const { validateId } = require("../middleware/_id");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

const { getSocket } = require("../startup/socket");
const { required, valid } = require("joi");

let user;
// load all previous messages
router.get("/", auth, async (req, res) => {
  const msgList = await Message.find()
    .sort({ date: 1 })
    .select("-__v")
    .populate("user", { nwi: 1, _id: 1 });

  for (msg of msgList) {
    if (msg.user._id.toString() === req.user._id) msg.user.nwi = "Me";
    msg.user.isAdmin = req.user.isAdmin ? true : false;
  }

  res.send(JSON.stringify(msgList));
});

// get socket connection
const io = getSocket();

// check socket connection
io.on("connection", async (socket) => {
  // console.log(`Socket connected with id: ${socket.id}`); // each socket has an unique id

  // checking user token
  const token = socket.handshake.auth.token;
  if (!token)
    return socket.emit(
      "client_error",
      new Error("Access denied. No token provided")
    );

  // check if a valid token
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    socket.handshake.user = decoded;
    // console.log(decoded);
  } catch (error) {
    console.log(error.message);
    return socket.emit("server_error", "Something failed");
  }

  // joined community room to get every one together. Don't really need for single chat. But if .to("room") is used, need to .join("room")
  socket.join("community");

  // send-messages
  socket.on("send-message", async (message) => {
    const msg = await Message.create({
      message,
      user: socket.handshake.user._id,
    });

    let resMsg = JSON.stringify(msg); // convert to a json for avoid mongoose object type
    resMsg = JSON.parse(resMsg); // converting to javascript object
    resMsg.user = {
      _id: socket.handshake.user._id,
      isAdmin: socket.handshake.user.isAdmin ? true : false,
    };

    socket
      .to("community")
      .emit("receive-message", resMsg, socket.handshake.user.nwi); // using .to("room") is better than .broadcast
  });

  socket.on("delete-message", async (_id) => {
    // is Admin
    if (!socket.handshake.user.isAdmin)
      return socket.emit("client_error", new Error("Access denied."));

    // validateId
    const { error } = validateId({ _id: socket.handshake._id });
    if (error) return socket.emit("client_error", new Error("Invalid ID"));

    const msg = await Message.findOne({ _id: _id });
    msg.message = `Deleted by Admin on ${new Date.now()}`;
    await msg.save();

    socket.to("community").emit("delete-by-admin");
  });
});

module.exports = router;