const config = require("config");

module.exports = function () {
  /* initial verifications */
    if (!config.get("mongodb")) {
      // set hms_mongo_url=mongodb://127.0.0.1:27017/vidly
      throw new Error("FATAL ERROR: mongodb is not defined");
    }
    if (!config.get("jwtPrivateKey")) {
      // set hms_jwtPrivateKey=Sahan123
      throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
    }
};
