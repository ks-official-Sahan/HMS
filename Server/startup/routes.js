const express = require("express");

/* routes */
const users = require("../routes/users");
const admins = require("../routes/admins");
const auth = require("../routes/auth");
const statics = require("../routes/statics");
const leaves = require("../routes/leaves");
const claims = require("../routes/claims");
const status = require("../routes/status");
const community = require("../routes/community");
const notifications = require("../routes/notifications");

/* custom middlewares */
const morgan = require("morgan");
const cors = require("cors");
const error = require("../middleware/error");

module.exports = function (app) {

  /* middleware */
  app.use(express.json());
  app.use(cors({ origin: "*" }));
  if (
    app.get("env") === "development" ||
    process.env.NODE_ENV === "development"
  ) {
    app.use(morgan("tiny"));
  }

  /* custom middleware */
  app.use(error);

  /* route management */
  app.use("/api/users", users);
  app.use("/api/admins", admins);
  app.use("/api/auth", auth);
  app.use("/api/statics", statics);
  app.use("/api/leaves", leaves);
  app.use("/api/claims", claims);
  app.use("/api/status", status);
  app.use("/api/community", community);
  app.use("/api/notifications", notifications);

  // app.get("/", async (req, res) => res.send("Hello"));
};
