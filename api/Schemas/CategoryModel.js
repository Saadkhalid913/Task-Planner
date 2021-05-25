const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 3, maxlength: 255, unique: true},
})


module.exports = CategorySchema;