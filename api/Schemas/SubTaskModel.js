const mongoose = require("mongoose");
const Joi = require("joi")

const SubTaskSchema = new mongoose.Schema({
  name: {type: String, minlength: 3, maxlength: 255, required: true},
  priority: {type: String, enum:["low", "medium", "high", "urgent", "undecided"], default: "undecided", lowercase: true},
  Deadline: {type: Date, required: false},
  Completed: Boolean
})


// WIP function 
function validateSubtask(body) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    priority: Joi.string().lowercase().valid("low", "medium", "high", "urgent", "undecided")
  })
  const result = schema.validate(body)
  console.log(result.error)
  if (!result.error) return true
  return false 
}

module.exports.SubTaskSchema = SubTaskSchema
// module.exports.validateSubtask = validateSubtask


