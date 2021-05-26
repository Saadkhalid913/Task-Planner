const mongoose = require("mongoose");
const SubTaskSchema = require("./SubTaskModel").SubTaskSchema
const TaskSchema = new mongoose.Schema({
  name: {type: String, minlength: 3, maxlength: 255, required: true},
  description: {type: String, minlength: 3, maxlength: 255, required: false},
  priority: {type: String, enum:["low", "medium", "high", "urgent", "undecided"], default: "undecided", lowercase: true},
  link: {type: String, required: false, minlength: 8, maxlength: 255},
  deadline: {type: Date, required: false},
  subtasks: {type: [SubTaskSchema], default: Array},
  category: {type:String, default: "Unset", lowercase: true, unique: true, minlength: 3, maxlength: 255}
})

module.exports = TaskSchema