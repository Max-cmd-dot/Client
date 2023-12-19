const express = require("express");
const router = express.Router();
const { Group } = require("../models/group"); // Replace with the actual model for your work groups

// GET route to check if a group exists
router.get("/checkgroup", async (req, res) => {
  const { group } = req.query;

  try {
    console.log("Group name: ", group);
    const existingGroup = await Group.findOne({ name: group });
    const exists = !!existingGroup;
    console.log("Group exists: ", exists);
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
});
router.get("/abo", async (req, res) => {
  const { group } = req.query;

  try {
    const Abo = await Group.findOne({ name: group });
    if (Abo) return res.json(Abo);
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
});
// PUT route to update a group // for the settings of notifications
router.put("/update", async (req, res) => {
  const { groupId } = req.query;
  const { settings } = req.body;
  console.log("Group ID: ", groupId);
  try {
    const group = await Group.findOneAndUpdate(
      { name: groupId },
      { $set: { settings: settings } },
      { new: true }
    );
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
