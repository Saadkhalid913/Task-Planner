const mongoose = require("mongoose");
const SubTaskSchema = require("./SubTaskModel")
const TaskSchema = new mongoose.Schema({
  name: {type: String, minlength: 3, maxlength: 255, required: true},
  priority: {type:String, enum: ["Low, Medium, High, Urgent", "None"], default: "None"},
  link: {type: String, required: false, minlength: 8, maxlength: 255},
  deadline: {type: Date, required: false},
  subtasks: {type: [SubTaskSchema], default: [SubTaskSchema]}
})

module.exports = TaskSchema