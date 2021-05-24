const express = require("express");
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/TaskPlanner")

const TaskRouter = require("./api/routes/Tasks")

const subtask = require("./api/Schemas/Schemas").SubTaskModel


const app = express()

app.use(express.json())
app.use("/api/tasks", TaskRouter) // add validation to all routes 
                                  // add validation to schemas 

const PORT = 3000;

app.listen(PORT, () => console.log("Server listening on port: " + PORT))