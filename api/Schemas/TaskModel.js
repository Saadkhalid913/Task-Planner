const mongoose = require("mongoose");
const SubTaskSchema = require("./SubTaskModel")
const TaskSchema = new mongoose.Schema({
  name: {type: String, minlength: 3, maxlength: 255, required: true},
  priority: {type: String, enum:["low", "medium", "high", "urgent", "undecided"], default: "undecided", lowercase: true},
  link: {type: String, required: false, minlength: 8, maxlength: 255},
  deadline: {type: Date, required: false},
  subtasks: {type: [SubTaskSchema], default: Array}
})

module.exports = TaskSchema