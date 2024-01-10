const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    /* initializing connection to MongoDB */
    mongoose
        // .connect("mongodb://127.0.0.1:27017/hms")
        .connect(config.get('mongodb'))
        .then(() => winston.info("MongoDB Connected..."));

}