import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import styles from "./styles.module.css";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
} from "chart.js";
import ClipLoader from "react-spinners/ClipLoader";

Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale
);

const apiUrl = process.env.REACT_APP_API_URL;

const History = () => {
  const groupId = localStorage.getItem("groupId");
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [], // Add labels array here if needed
    datasets: [
      {
        label: "Default Dataset",
        data: [], // Add default data array here
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      const humidityResponse = await axios.get(
        `${apiUrl}/api/data/all/humidity?groupId=${groupId}`
      );
      const humidityData = humidityResponse.data; // Process the humidity data if needed

      const luxResponse = await axios.get(
        `${apiUrl}/api/data/all/lux?groupId=${groupId}`
      );
      const luxData = luxResponse.data; // Process the lux data if needed

      const temperatureResponse = await axios.get(
        `${apiUrl}/api/data/all/temperature?groupId=${groupId}`
      );
      const temperatureData = temperatureResponse.data; // Process the temperature data if needed

      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: humidityData, // Update default dataset data with humidityData
          },
        ],
      }));

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount

    // Set interval to fetch data every 15 seconds if needed
    const interval = setInterval(() => {
      fetchData();
    }, 15000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Add dataset to the chart
  const addDataset = () => {
    console.log("Added Dataset");
  };

  // Add filter
  const addFilter = () => {
    console.log("Added filter");
  };

  // Change chart type
  const changeChartType = (type) => {
    // Logic to change the chart type
  };

  return (
    <div>
      <h1 className={styles.heading}>History</h1>

      {isLoading ? (
        <div className={styles.loaderContainer}>
          <ClipLoader color="#ffffff" loading={isLoading} />
        </div>
      ) : (
        <div>
          <Line data={chartData} />

          <div>
            <button onClick={addDataset}>Add Dataset</button>
            <button onClick={addFilter}>Add Filter</button>
            <button onClick={() => changeChartType("bar")}>
              Change to Bar Chart
            </button>
            <button onClick={() => changeChartType("line")}>
              Change to Line Chart
            </button>
            {/* Add other chart type buttons if needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
