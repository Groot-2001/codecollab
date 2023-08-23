const express = require("express");
const router = express.Router();
const Task = require("../models/task");

router.get("/createTask", async (req, res) => {
  try {
    const newTask = await Task.create({});
    res.redirect("/task/" + newTask._id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/task/:id", async (req, res) => {
  try {
    if (req.params.id) {
      const task = await Task.findOne({ _id: req.params.id });
      if (task) {
        res.render("task", { task });
      } else {
        console.log("error: error while finding the task from db..");
        res.status(400).json({ message: "error while finding task" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
