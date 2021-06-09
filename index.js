const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const config = require("config");

const mongoose_link = (config.get("mongoose_link"))
if (!mongoose_link) throw new Error("No mongoose cluster specified")
console.log(mongoose_link)

mongoose.connect(mongoose_link)

const TaskRouter = require("./api/routes/Tasks")
const CategoryRouter = require("./api/routes/Categories")

const app = express()

app.use(express.json())
app.use(cors({ origin: "*" }))
app.use("/api/tasks", TaskRouter) // add validation to all routes 
app.use("/api/categories", CategoryRouter) // add validation to schemas 



const PORT = 3000 || process.env.PORT

app.listen(PORT, () => console.log("Server listening on port: " + PORT))