const { Province, Position, Department } = require("../models/statics");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/hms")
  // .connect(config.get('mongodb'))
  .then(() => {
    console.log("MongoDB Connected");
    insertData();
  })
  .catch((err) => console.log(err.message));

const provinces = [
  "Central Province",
  "Eastern Province",
  "North Central Province",
  "Northern Province",
  "North Western Province",
  "Sabaragamuwa Province",
  "Uva Province",
  "Western Province",
  "Southern Province",
];
const positions = ["Director", "Manager", "Employee"];
const departments = ["IT Department", "Accounting Department", "HR Depart"];

async function insertData() {
  try {
    for (var name of provinces) {
      await Province.create({ name: name });
      console.log(name);
    }
    for (var name of positions) {
      await Position.create({ name: name });
      console.log(name);
    }
    for (var name of departments) {
      await Department.create({ name: name });
      console.log(name);
    }

    console.log("Data inserted successfully");
  } catch (error) {
    console.log("Something failed", error.message);
    process.exit(1);
  }
}
