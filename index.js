const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")
mongoose.connect("mongodb://localhost:27017/TaskPlanner")

const TaskRouter = require("./api/routes/Tasks")
const CategoryRouter = require("./api/routes/Categories")

const subtask = require("./api/Schemas/Schemas").SubTaskModel


const app = express()

app.use(express.json())
app.use(cors({origin: "*"}))
app.use("/api/tasks", TaskRouter) // add validation to all routes 
app.use("/api/categories", CategoryRouter) // add validation to schemas 

            

const PORT = 3000;

app.listen(PORT, () => console.log("Server listening on port: " + PORT))