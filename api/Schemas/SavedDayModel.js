const mongoose = require("mongoose")
const CategorySchema = require("./CategoryModel")
const GetCurrentDate = require("../HelperFunction").GetCurrentDate

const DaySchema = new mongoose.Schema({
  tasks: {type: [CategorySchema], default: []},
  dayID: {type: Number, default: GetCurrentDate}
})

module.exports = DaySchema