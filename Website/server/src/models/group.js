const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  package: { type: String, required: true },
  employee: { type: [String], required: true },
  settings: { type: Array },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
