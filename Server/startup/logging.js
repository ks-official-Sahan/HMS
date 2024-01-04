require('express-async-errors'); // replaced async.js usage with this package

const winston = require('winston');

module.exports = function () {

    winston.add(new winston.transports.File({
        filename: 'logs.log',
        handleExceptions: true,
        handleRejections: true,
    })); //added new transport to log errors into File; default is Console.

    winston.add(new winston.transports.Console({
        handleExceptions: true,
        handleRejections: true,
    }));

    winston.format = winston.format.colorize();

    process.on('uncaughtException', (err) => {
        throw err;
    });
    process.on('unhandledRejection', (err) => {
        throw err;
    });

}
