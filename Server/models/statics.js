const mongoose = require("mongoose");

const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
});
const Province = mongoose.model('Province', provinceSchema);

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
});
const Department = mongoose.model('Department', departmentSchema);

const positionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
});
const Position = mongoose.model('Position', positionSchema);

exports.Province = Province;
exports.Position = Position;
exports.Department = Department;