const { Server } = require("socket.io");

let io;

// module.exports.createSocket = function (server) {
module.exports = function (server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
};

module.exports.getSocket = function () {
    return io;
}