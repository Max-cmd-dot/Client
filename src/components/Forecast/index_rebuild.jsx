import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import ClipLoader from "react-spinners/ClipLoader";
import ButtonGroup from "../ButtonGroup/button-group";
import { useSelector, useDispatch } from "react-redux";
import { changeRoute } from "../../reduxStore";
import Cookies from "js-cookie";
import styles from "./styles.module.css";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-moment";

Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend
);

const apiUrl = process.env.REACT_APP_API_URL;
const groupId = Cookies.get("groupId");

const fetchData = async (endpoint, count) => {
  const { data } = await axios.get(
    `${apiUrl}/api/data/${endpoint}?groupId=${groupId}&count=${count}`
  );
  return data
    .map((entry) => ({
      time: new Date(entry.data.time).toISOString(),
      value: entry.data.value,
    }))
    .reverse();
};

const fetchWeatherData = async (location = "Hamburg", days = 3) => {
  const { data } = await axios.get(
    `http://api.weatherapi.com/v1/forecast.json?key=d50cfcc0887343f39cf193820230409&q=${location}&days=${days}&aqi=no&alerts=no`
  );
  return data.forecast.forecastday.flatMap((day) =>
    day.hour.map((hour) => ({
      time: hour.time,
      temp_c: hour.temp_c,
    }))
  );
};

const getAllHoursOfDay = () =>
  Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setHours(i, 0, 0, 0);
    return date.toISOString().split(":")[0] + ":00";
  });

const fillMissingData = (data, allHours) =>
  allHours.map((hour) => {
    const dataAtHour = data.find(
      (entry) => new Date(entry.time).getHours() === new Date(hour).getHours()
    );
    return dataAtHour || { time: hour, value: NaN };
  });

const getMinMaxValues = (data, padding = 7) => {
  const values = data.map((d) => d.value).filter((val) => !isNaN(val));
  const min = Math.round(Math.min(...values) - padding);
  const max = Math.round(Math.max(...values) + padding);
  return { min, max };
};

const Forecast = () => {
  const [chartData, setChartData] = useState({
    temp: { data: [], forecast: [] },
    hum: { data: [], forecast: [] },
    bright: { data: [], forecast: [] },
  });
  const [chartType, setChartType] = useState("Temperature");
  const [loading, setLoading] = useState({
    temp: false,
    hum: false,
    bright: false,
  });
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPage);

  const handleButtonClick = (type) => setChartType(type);

  useEffect(() => {
    dispatch(changeRoute("/forecast"));
  }, [dispatch]);

  useEffect(() => {
    if (currentPage === "/forecast") {
      const fetchDataAndSetState = async (key) => {
        setLoading((prev) => ({ ...prev, [key]: true }));
        const data = await fetchData(key, 20000);
        const forecast = await fetchWeatherData();
        const allHours = getAllHoursOfDay();
        const filledData = fillMissingData(data, allHours);
        const filledForecast = fillMissingData(forecast, allHours);
        setChartData((prev) => ({
          ...prev,
          [key]: { data: filledData, forecast: filledForecast },
        }));
        setLoading((prev) => ({ ...prev, [key]: false }));
      };

      fetchDataAndSetState("temp");
      fetchDataAndSetState("hum");
      fetchDataAndSetState("bright");
    }
  }, [currentPage]);

  const chartTypeMapping = {
    Temperature: { dataKey: "temp", label: "Temperature" },
    Humidity: { dataKey: "hum", label: "Humidity" },
    Brightness: { dataKey: "bright", label: "Brightness" },
  };

  const currentChartData = chartData[chartTypeMapping[chartType].dataKey];
  const minMaxValues = getMinMaxValues([
    ...currentChartData.data,
    ...currentChartData.forecast,
  ]);

  return (
    <div>
      <ButtonGroup
        buttons={["Temperature", "Humidity", "Brightness"]}
        onClick={handleButtonClick}
      />
      <Line
        data={{
          labels: currentChartData.data.map((d) => d.time),
          datasets: [
            {
              label: chartTypeMapping[chartType].label,
              data: currentChartData.data.map((d) => d.value),
              fill: false,
              borderColor: "rgba(75,192,192,1)",
            },
            {
              label: `${chartTypeMapping[chartType].label} Forecast`,
              data: currentChartData.forecast.map((d) => d.temp_c),
              fill: false,
              borderColor: "rgba(153,102,255,1)",
            },
          ],
        }}
        options={{
          scales: {
            y: {
              min: minMaxValues.min,
              max: minMaxValues.max,
            },
          },
        }}
      />
      {loading[chartTypeMapping[chartType].dataKey] && <ClipLoader />}
    </div>
  );
};

export default Forecast;
