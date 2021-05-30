const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()


// add joi validation export function later to this module 
const TaskModel = require("../Schemas/Schemas").TaskModel
const SubTaskModel = require("../Schemas/Schemas").SubTaskModel 
const validateSubtask = require("../Schemas/SubTaskModel").validateSubtask

router.get("/", async (req,res) => {
  const query = await TaskModel.find().sort()
  res.send(query)
})

router.post("/", async (req, res) => {
  // add validation and add joi function  
  const body = req.body
  const newTask = new TaskModel(body)
  console.log(newTask)
  const response = await newTask.save().catch(err => res.status(400).send(err))
  res.send(response)
})

router.post("/subtasks/:id", async (req, res) => {
  const body = req.body
  const id = req.params.id
  const newSubtask = new SubTaskModel(body);
  const Task = await TaskModel.findById(id);
  Task.subtasks.push(newSubtask)
  try{
    const response = await Task.save()
    res.send(response)
    console.log(response)
  }
  catch(err) {
    res.status(400).send(err.errors)
  }
})

router.delete("/:id", async (req,res) => {
  const id = req.params.id;
  const task = await TaskModel.findByIdAndDelete(id)
  if (!task) return response.status(400).send("Could not find task by given id")
  return res.send(task)
})

module.exports = router