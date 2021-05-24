const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()


// add joi validation export function later to this module 
const TaskModel = require("../Schemas/Schemas").TaskModel
const SubTaskModel = require("../Schemas/Schemas").SubTaskModel 
const validateSubtask = require("../Schemas/SubTaskModel").validateSubtask

const validate = 

console.log(TaskModel)
router.get("/", async (req,res) => {
  const query = await TaskModel.find().sort()
  res.send(query)
})

router.post("/", async (req, res) => {
  // add validation and add joi function  
  const body = req.body
  const newTask = new TaskModel(body)
  console.log(newTask)
  const response = await newTask.save().catch(err => res.send(err))
  res.send(response)
})

router.post("/subtask/:id", async (req, res) => {
  const body = req.body
  const id = req.params.id
  const newSubtask = new SubTaskModel(body);
  const Task = await TaskModel.findById(id);
  Task.subtasks.push(newSubtask)
  try{
    const response = await Task.save()
    res.send(response)
  }
  catch(err) {
    res.send(err.errors)
  }
})


module.exports = router