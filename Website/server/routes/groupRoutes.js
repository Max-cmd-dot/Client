const express = require("express");
const router = express.Router();
const Group = require("../models/group"); // Replace with the actual model for your work groups

// GET route to check if a group exists
router.get("/", async (req, res) => {
  const { group } = req.query;

  try {
    const existingGroup = await Group.findOne({ name: group });
    const exists = !!existingGroup;
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
});

module.exports = router;
