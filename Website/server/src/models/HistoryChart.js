const mongoose = require("mongoose");

const ChartDataSchema = new mongoose.Schema(
  {
    labels: [String],
    type: { type: String, enum: ["line", "scatter"], default: "line" },
    max_count: { type: Number, default: 100 },
    data_interval: { type: Number, default: 1 },
    update_interval: { type: Number, default: 1 },
    datasets: [
      {
        checked_temperature: { type: Boolean, default: false },
        checked_humidity: { type: Boolean, default: false },
        checked_lux: { type: Boolean, default: false },
        checked_moisture_1: { type: Boolean, default: false },
        checked_moisture_2: { type: Boolean, default: false },
        checked_moisture_3: { type: Boolean, default: false },
      },
    ],
  },
  { _id: false }
);

const ChartSchema = new mongoose.Schema(
  {
    chartId: String,
    chartName: String,
    chartData: ChartDataSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const HistoryChartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  charts: { type: [ChartSchema], default: [], required: false },
  createdAt: { type: Date, default: Date.now, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
});

const HistoryChart = mongoose.model(
  "HistoryChart",
  HistoryChartSchema,
  "history"
);
module.exports = { HistoryChart };
