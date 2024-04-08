const winston = require("winston");

const express = require("express");
const { createServer } = require("node:http");
// const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// const {createSocket} = require("./startup/socket");
// createSocket(server);
require("./startup/socket")(server);

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/db")();
require("./startup/validation")();

/* 
set PORT= 0-65535 any port or leave it default by 3000;
client side is directed to port 3000;
*/
const port = process.env.PORT || 3000;
server.listen(port, () => {
  winston.info(`Health Management System is listening on port ${port}!`);
});
