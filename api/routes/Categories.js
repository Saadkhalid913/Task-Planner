const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const CategoryModel = require("../Schemas/Schemas").CategoryModel

router.get("/", async(req,res) =>{
  const result = await CategoryModel.find().sort("_id").catch(err => res.send(err))
  res.send(result)
})

router.post("/", async (req,res) => {
  const body = req.body
  const NewCategory = new CategoryModel(body)

  const result = await NewCategory.save().catch(err => res.send(err))
  if (!result) return
  return res.send(result)
})

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = CategoryModel.findByIdAndDelete(id)
  if (!result) return res.send("Could not find a category by that id");
  return res.send(result)
})

module.exports = router