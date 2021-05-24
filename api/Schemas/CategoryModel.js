const mongoose = require("mongoose");
const TaskSchema = require("./TaskModel")

const CategorySchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 3, maxlength: 255, unique: true},
  tasks: {type: [TaskSchema], default: []}
})


module.exports = CategorySchema;