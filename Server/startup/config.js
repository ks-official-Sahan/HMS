const config = require('config');

module.exports = function () {

    /* initial verifications */
    if (!config.get('jwtPrivateKey')) { // set hms_jwtPrivateKey=Sahan123
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }
    if (!config.get('mongodb.connection')) { // set hms_mongo_url=mongodb://127.0.0.1:27017/vidly
        throw new Error('FATAL ERROR: mongodb.connection is not defined');
    }

}