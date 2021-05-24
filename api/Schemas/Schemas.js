const CategorySchema = require("./CategoryModel")
const TaskSchema = require("./TaskModel")
const SubTaskSchema = require("./SubTaskModel").SubTaskSchema
const mongoose = require("mongoose")

module.exports.CategoryModel = mongoose.model("Category", CategorySchema)
module.exports.TaskModel = mongoose.model("Task", TaskSchema)
module.exports.SubTaskModel = mongoose.model("Subtask", SubTaskSchema)