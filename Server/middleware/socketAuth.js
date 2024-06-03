// const { validateId } = require("./_id");

// module.exports.authToken = function (socket, next) {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("Access denied. No token provided"));

//   try {
//     const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
//     socket.handshake.user = decoded;

//     next();
//   } catch (error) {
//     next(error.message);
//   }
// };

// module.exports.socketAdmin = function (socket, next) {
//   if (!socket.handshake.user.isAdmin) return next(new Error("Access denied."));
//   next();
// };

// module.exports.socket_id = function (socket, next) {
//   const { error } = validateId({ _id: socket.handshake._id });
//   if (error) return next(new Error("Invalid ID"));
//   next();
// };
