const winston = require('winston');

module.exports = function (err, req, res, next) {
    // console.log(err.message);
    // winston.log('error', err.message, err);

    winston.error(err.message, err); // winston.log('error', err.message, err) ==  -> true
    res.status(500).send("Something Failed");

    next();
}