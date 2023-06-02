const router = require("express").Router();
const { Data, validate } = require("../models/apidata");

router.get("/latestdata/Temperature", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/air/temperature",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/latestdata/Humidity", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/air/humidity",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/latestdata/Moisture/1", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/ground/moisture/1",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/latestdata/Lux", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/ground/light/lux",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/latestdata/All", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      $or: [
        { topic: "esp/ground/moisture/1" },
        { topic: "esp/air/temperature" },
        { topic: "esp/air/humidity" },
        { topic: "esp/ground/light/lux" },
        { topic: "esp/ground/light/red" },
        { topic: "esp/ground/light/green" },
        { topic: "esp/ground/light/blue" },
        { topic: "esp/ground/light/clear" },
        { topic: "esp/air/pressure" },
        { topic: "esp/ground/moisture/2" },
        { topic: "esp/ground/moisture/3" },
      ],
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(11);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/temperature", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/air/temperature",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1000);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/humidity", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/air/humidity",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1000);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/Lux", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/ground/light/lux",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1000);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/moisture/1", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/ground/moisture/1",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1000);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/moisture/2", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/ground/moisture/2",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1000);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/moisture/3", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const data = await Data.find({
      topic: "esp/ground/moisture/3",
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(1000);
    if (data) return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
