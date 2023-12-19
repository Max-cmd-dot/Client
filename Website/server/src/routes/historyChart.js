const express = require("express");
const router = express.Router();
const { HistoryChart } = require("../models/HistoryChart"); // replace with the actual path to your HistoryChart model

// Route to get all charts for a user
router.get("/all/:userId", async (req, res) => {
  try {
    const historyChart = await HistoryChart.findOne({
      userId: req.params.userId,
    });
    if (!historyChart) {
      return res.status(404).json({ error: "No history chart found." });
    }
    res.json(historyChart);
  } catch (err) {
    console.error(`Error getting charts for user: ${req.params.userId}`, err);
    res.status(500).json({ error: "An error occurred while getting charts." });
  }
});
router.get("/settings/:userId/:chartName", async (req, res) => {
  try {
    const historyChart = await HistoryChart.findOne({
      userId: req.params.userId,
    });
    const chart1 = historyChart.charts.find(
      (chart) => chart.chartName === req.params.chartName
    );
    if (!historyChart) {
      return res.status(404).json({ error: "No history chart found." });
    }
    res.json(chart1.chartData);
  } catch (err) {
    console.error(`Error getting charts for user: ${req.params.userId}`, err);
    res.status(500).json({ error: "An error occurred while getting charts." });
  }
});
router.post("/update/:userId", async (req, res) => {
  const {
    chartId = "defaultId",
    chartName = "Default Name",
    chartData = {},
  } = req.body;
  const newChart = {
    chartId,
    chartName,
    chartData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    const historyChart = await HistoryChart.findOneAndUpdate(
      { userId: req.params.userId },
      { $push: { charts: newChart } },
      { new: true, upsert: true }
    );
    res.json(historyChart);
  } catch (err) {
    console.error(`Error adding new chart for user: ${req.params.userId}`, err);
    res
      .status(500)
      .json({ error: "An error occurred while adding a new chart." });
  }
});

// Route to update a chart for a user
router.put("/change_datasets/:userId/:chartName/:dataTyp", async (req, res) => {
  try {
    const { checked } = req.body;
    const { userId, chartName, dataTyp } = req.params;
    const checkedField = `charts.$.chartData.datasets.0.checked_${dataTyp}`;

    const historyChart = await HistoryChart.findOneAndUpdate(
      { userId: userId, "charts.chartName": chartName },
      { $set: { [checkedField]: checked } },
      { new: true }
    );

    if (!historyChart) {
      return res.status(404).json({ error: "No history chart found." });
    }
    res.json(historyChart);
  } catch (err) {
    console.error(`Error updating chart for user: ${userId}`, err);
    res.status(500).json({ error: "An error occurred while updating charts." });
  }
});
router.put("/change_type/:userId/:chartName", async (req, res) => {
  try {
    const { type } = req.body;
    const { userId, chartName } = req.params;

    const historyChart = await HistoryChart.findOneAndUpdate(
      { userId: userId, "charts.chartName": chartName },
      { $set: { "charts.$.chartData.type": type } },
      { new: true }
    );

    if (!historyChart) {
      return res.status(404).json({ error: "No history chart found." });
    }
    res.json(historyChart);
  } catch (err) {
    console.error(`Error updating chart type for user: ${userId}`, err);
    res
      .status(500)
      .json({ error: "An error occurred while updating chart type." });
  }
});
router.put("/change_data_interval/:userId/:chartName", async (req, res) => {
  try {
    const { data_interval } = req.body;
    const { userId, chartName } = req.params;

    const historyChart = await HistoryChart.findOneAndUpdate(
      { userId: userId, "charts.chartName": chartName },
      { $set: { "charts.$.chartData.data_interval": data_interval } },
      { new: true }
    );

    if (!historyChart) {
      return res.status(404).json({ error: "No history chart found." });
    }
    res.json(historyChart);
  } catch (err) {
    console.error(`Error updating data interval for user: ${userId}`, err);
    res
      .status(500)
      .json({ error: "An error occurred while updating data interval." });
  }
});
router.put("/change_update_interval/:userId/:chartName", async (req, res) => {
  try {
    const { update_interval } = req.body;
    const { userId, chartName } = req.params;

    const historyChart = await HistoryChart.findOneAndUpdate(
      { userId: userId, "charts.chartName": chartName },
      { $set: { "charts.$.chartData.update_interval": update_interval } },
      { new: true }
    );

    if (!historyChart) {
      return res.status(404).json({ error: "No history chart found." });
    }
    res.json(historyChart);
  } catch (err) {
    console.error(`Error updating update interval for user: ${userId}`, err);
    res
      .status(500)
      .json({ error: "An error occurred while updating update interval." });
  }
});
router.put("/change_max_count/:userId/:chartName", async (req, res) => {
  try {
    const { max_count } = req.body;
    const { userId, chartName } = req.params;

    const historyChart = await HistoryChart.findOneAndUpdate(
      { userId: userId, "charts.chartName": chartName },
      { $set: { "charts.$.chartData.max_count": max_count } },
      { new: true }
    );

    if (!historyChart) {
      return res.status(404).json({ error: "No history chart found." });
    }
    res.json(historyChart);
  } catch (err) {
    console.error(`Error updating max count for user: ${userId}`, err);
    res
      .status(500)
      .json({ error: "An error occurred while updating max count." });
  }
});
router.delete("/delete/:userId/:chartName", async (req, res) => {
  const { userId, chartName } = req.params;
  try {
    const historyChart = await HistoryChart.findOneAndUpdate(
      { userId },
      { $pull: { charts: { chartName: chartName } } },
      { new: true }
    );
    if (!historyChart) {
      return res.status(404).json({ error: "No chart found with this ID." });
    }
    res.json(historyChart);
  } catch (err) {
    console.error(`Error deleting chart for user: ${userId}`, err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the chart." });
  }
});

module.exports = router;
