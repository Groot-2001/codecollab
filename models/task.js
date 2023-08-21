const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: String,
});

module.exports = mongoose.model("task_model", taskSchema);
