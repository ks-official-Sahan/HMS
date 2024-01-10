require("express-async-errors"); // replaced async.js usage with this package

const winston = require("winston");

module.exports = function () {
  winston.add(
    new winston.transports.File({
      filename: "logs.log",
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.json(),
    })
  ); //added new transport to log errors into File; default is Console.

  winston.add(
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.prettyPrint()
      ),
    })
  ); //added new transport to log errors into File; default is Console.

  winston.exceptions.handle(
   new winston.transports.File({ filename: "exceptions.log", handleExceptions: true, handleRejections: true }),
   new winston.transports.Console({ colorize: true })
  );

  //process.on("uncaughtException", (err) => {
  // //winston.log('error', err.message, err);
  //throw err;
  //});
};
