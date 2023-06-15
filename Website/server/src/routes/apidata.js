const router = require("express").Router();
const { Data, validate } = require("../models/apidata");
router.get("/latestdata", (req, res) => {
  res.send("Running...");
});
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
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const minValue = parseFloat(req.query.minValue);
    const maxValue = parseFloat(req.query.maxValue);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const query = {
      topic: "esp/air/temperature",
      group: groupId,
    };

    if (startDate && endDate) {
      query.time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.time = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.time = {
        $lte: new Date(endDate),
      };
    }

    if (!isNaN(minValue) && !isNaN(maxValue)) {
      query.value = {
        $gte: minValue,
        $lte: maxValue,
      };
    } else if (!isNaN(minValue)) {
      query.value = {
        $gte: minValue,
      };
    } else if (!isNaN(maxValue)) {
      query.value = {
        $lte: maxValue,
      };
    }

    let data = await Data.find(query).sort({ _id: -1 }).limit(1000);

    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/humidity", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const minValue = parseFloat(req.query.minValue);
    const maxValue = parseFloat(req.query.maxValue);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const query = {
      topic: "esp/air/humidity",
      group: groupId,
    };

    if (startDate && endDate) {
      query.time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.time = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.time = {
        $lte: new Date(endDate),
      };
    }
    if (!isNaN(minValue) && !isNaN(maxValue)) {
      query.value = {
        $gte: minValue,
        $lte: maxValue,
      };
    } else if (!isNaN(minValue)) {
      query.value = {
        $gte: minValue,
      };
    } else if (!isNaN(maxValue)) {
      query.value = {
        $lte: maxValue,
      };
    }
    let data = await Data.find(query).sort({ _id: -1 }).limit(1000);

    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.get("/All/Lux", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const minValue = parseFloat(req.query.minValue);
    const maxValue = parseFloat(req.query.maxValue);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const query = {
      topic: "esp/ground/light/lux",
      group: groupId,
    };

    if (startDate && endDate) {
      query.time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.time = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.time = {
        $lte: new Date(endDate),
      };
    }

    if (!isNaN(minValue) && !isNaN(maxValue)) {
      query.value = {
        $gte: minValue,
        $lte: maxValue,
      };
    } else if (!isNaN(minValue)) {
      query.value = {
        $gte: minValue,
      };
    } else if (!isNaN(maxValue)) {
      query.value = {
        $lte: maxValue,
      };
    }

    let data = await Data.find(query).sort({ _id: -1 }).limit(1000);

    console.log("Data:", data);

    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/moisture/1", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const minValue = parseFloat(req.query.minValue);
    const maxValue = parseFloat(req.query.maxValue);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const query = {
      topic: "esp/ground/moisture/1",
      group: groupId,
    };

    if (startDate && endDate) {
      query.time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.time = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.time = {
        $lte: new Date(endDate),
      };
    }

    if (!isNaN(minValue) && !isNaN(maxValue)) {
      query.value = {
        $gte: minValue,
        $lte: maxValue,
      };
    } else if (!isNaN(minValue)) {
      query.value = {
        $gte: minValue,
      };
    } else if (!isNaN(maxValue)) {
      query.value = {
        $lte: maxValue,
      };
    }

    let data = await Data.find(query).sort({ _id: -1 }).limit(1000);

    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/moisture/2", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const minValue = parseFloat(req.query.minValue);
    const maxValue = parseFloat(req.query.maxValue);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const query = {
      topic: "esp/ground/moisture/2",
      group: groupId,
    };

    if (startDate && endDate) {
      query.time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.time = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.time = {
        $lte: new Date(endDate),
      };
    }

    if (!isNaN(minValue) && !isNaN(maxValue)) {
      query.value = {
        $gte: minValue,
        $lte: maxValue,
      };
    } else if (!isNaN(minValue)) {
      query.value = {
        $gte: minValue,
      };
    } else if (!isNaN(maxValue)) {
      query.value = {
        $lte: maxValue,
      };
    }

    let data = await Data.find(query).sort({ _id: -1 }).limit(1000);

    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/All/moisture/3", async (req, res) => {
  try {
    const { error } = validate(req.body);
    const groupId = req.query.groupId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const minValue = parseFloat(req.query.minValue);
    const maxValue = parseFloat(req.query.maxValue);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const query = {
      topic: "esp/ground/moisture/3",
      group: groupId,
    };

    if (startDate && endDate) {
      query.time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.time = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.time = {
        $lte: new Date(endDate),
      };
    }

    if (!isNaN(minValue) && !isNaN(maxValue)) {
      query.value = {
        $gte: minValue,
        $lte: maxValue,
      };
    } else if (!isNaN(minValue)) {
      query.value = {
        $gte: minValue,
      };
    } else if (!isNaN(maxValue)) {
      query.value = {
        $lte: maxValue,
      };
    }

    let data = await Data.find(query).sort({ _id: -1 }).limit(1000);

    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
