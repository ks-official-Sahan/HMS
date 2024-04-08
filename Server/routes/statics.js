const { Province, Position, Department } = require("../models/statics");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

router.get("/:type", async (req, res) => {
  if (req.params.type === "admin") {
    const positions = await Position.find({ name: { $ne: "Employee" } }).sort(
      "name"
    );

    const results = {
      positions: positions,
    };
    res.send(JSON.stringify(results));
  } else if (req.params.type === "user") {
    const provinces = await Province.find()
      .sort("name")
      .select({ _id: 1, name: 1 });
    const positions = await Position.find()
      .sort("name")
      .select({ _id: 1, name: 1 });
    const departments = await Department.find()
      .sort("name")
      .select({ _id: 1, name: 1 });

    const results = {
      provinces: provinces,
      positions: positions,
      departments: departments,
    };
    res.send(JSON.stringify(results));
  } else {
    const provinces = await Province.find()
      .sort("name")
      .select({ _id: 1, name: 1 });

    res.send(JSON.stringify(provinces));
  }
});

module.exports = router;
