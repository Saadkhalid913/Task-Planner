const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {type: String, minlength: 3, maxlength: 255, required: true},
  priority: {type:String, enum: ["Low, Medium, High, Urgent", "None"], default: "None"},
  Link: {type: String, required: false, minlength: 8, maxlength: 255},
  Deadline: {type: Date, required: false}
})

module.exports = TaskSchema