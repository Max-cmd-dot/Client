const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  Abo: { type: String, required: true, unique: true }
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
//# sourceMappingURL=group.js.map