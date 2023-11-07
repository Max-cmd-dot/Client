import styles from "./styles.module.css";
import { Doughnut } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "chartjs-adapter-moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
const apiUrl = process.env.REACT_APP_API_URL;
import { changeRoute } from "../../reduxStore";
// needed for dayClick

import {
  Chart,
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
} from "chart.js";
Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale
);

import { useSelector, useDispatch } from "react-redux";
const Main = () => {
  let [list, setList] = useState([]);
  let [list2, setList2] = useState([]);
  const groupId = localStorage.getItem("groupId");
  const [rightabo, setRightabo] = useState(false);
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  // Use another effect hook to dispatch changeRoute when the component mounts
  useEffect(() => {
    dispatch(changeRoute("/"));
  }, [dispatch]); // Re-run the effect if dispatch changes

  useEffect(() => {
    if (currentPage === "/") {
      const fetchData_notification = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/notification/latestdata/notifications?groupId=${groupId}`
          );
          const valuesArr = response.data.map((item2) => ({
            message: item2.message,
            time: new Date(item2.time).toISOString(), // Convert to ISO string
            group: item2.group,
          }));
          setList2(valuesArr);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData_notification();
      const interval = setInterval(fetchData_notification, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [groupId]);

  const events = [
    {
      title: "Bereich 1 gießen",
      category: "time",
      start: "2023-08-30T12:00:00",
      end: "2023-08-30T13:30:00",
    },
    ...list2
      .filter((item2) => item2.ignore !== "true")
      .map((item2) => ({
        title: item2.message,
        category: "time",
        start: item2.time,
        end: item2.time,
      })),
  ];
  useEffect(() => {
    if (currentPage === "/") {
      const fetchData_abo = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/group/abo?group=${groupId}`
          );

          setRightabo(response.data.package);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData_abo();
      const interval = setInterval(fetchData_abo, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);
  useEffect(() => {
    if (currentPage === "/") {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/data/latestdata/all?groupId=${groupId}`
          );
          const valuesArr = [];
          let counter = 0;
          for (let item in response.data) {
            if (counter < 100) {
              valuesArr.push({
                topic: response.data[item].topic,
                value: response.data[item].value,
              });
              counter++;
            }
          }

          // Filter out any duplicate items from valuesArr
          const uniqueValuesArr = valuesArr.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.topic === item.topic)
          );

          setList(uniqueValuesArr);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  const isMediumOrBig = rightabo === "medium" || rightabo === "big";
  const topicOrder = [
    "esp/air/temperature",
    "esp/ground/light/lux",
    "esp/ground/moisture/1",
    "esp/air/pressure",
    "esp/air/humidity",
  ];
  // Sort the list array based on the desired order of topics
  const sortedList = list.sort(
    (a, b) => topicOrder.indexOf(a.topic) - topicOrder.indexOf(b.topic)
  );

  //temperature chart
  let temperatureValue = 30;
  if (sortedList) {
    const temperatureItem = sortedList.find(
      (item) => item.topic === "esp/air/temperature"
    );
    temperatureValue = temperatureItem ? temperatureItem.value : 0;
  }

  const maxTemperatureValue = 40;
  const greenEnd_temperature = (7 / maxTemperatureValue) * 100;
  const yellowEnd_temperature = (25 / maxTemperatureValue) * 100;
  const canvas_temperature = document.createElement("canvas");
  const ctx_temperature = canvas_temperature.getContext("2d");
  const gradient_temperature = ctx_temperature.createLinearGradient(
    0,
    0,
    200,
    0
  );
  gradient_temperature.addColorStop(0, "lightblue");
  gradient_temperature.addColorStop(greenEnd_temperature / 100, "green");
  gradient_temperature.addColorStop(yellowEnd_temperature / 100, "yellow");
  gradient_temperature.addColorStop(1, "red");

  const adjustedTemperatureValue =
    (temperatureValue / maxTemperatureValue) * 100;
  const data_chart_temperature = {
    datasets: [
      {
        data: [adjustedTemperatureValue, 100 - adjustedTemperatureValue],
        backgroundColor: [gradient_temperature, "transparent"],
        borderWidth: 0,
        value: temperatureValue,
        datalabels: {
          display: true,
          formatter: (value) => `${value}°C`,
        },
      },
    ],
  };

  const options_chart_temperature = {
    rotation: 270, // start angle in degrees
    circumference: 180, // sweep angle in degrees
    plugins: {
      datalabels: {
        display: true,
        backgroundColor: "white",
        borderRadius: 4,
        color: "black",
        font: {
          weight: "bold",
        },
      },
    },
    cutout: "92%",
  };
  //Brightness chart
  let brightnessValue = 2000;
  if (sortedList) {
    const brightnessItem = sortedList.find(
      (item) => item.topic === "esp/ground/light/lux"
    );
    brightnessValue = brightnessItem ? brightnessItem.value : 0;
  }
  const maxbrightnessValue = 2000;
  const greenEnd_brightness = (10 / maxbrightnessValue) * 100;
  const yellowEnd_brightness = (150 / maxbrightnessValue) * 100;
  const canvas_brightness = document.createElement("canvas");
  const ctx_brightness = canvas_brightness.getContext("2d");
  const gradient_brightness = ctx_brightness.createLinearGradient(
    0,
    0,
    2000,
    0
  );
  gradient_brightness.addColorStop(0, "black");
  gradient_brightness.addColorStop(greenEnd_brightness / 100, "blue");
  gradient_brightness.addColorStop(yellowEnd_brightness / 100, "lightblue");
  gradient_brightness.addColorStop(1, "white");

  const adjustedbrightnessValue = (brightnessValue / maxbrightnessValue) * 100;
  const data_chart_brightness = {
    datasets: [
      {
        data: [adjustedbrightnessValue, 100 - adjustedbrightnessValue],
        backgroundColor: [gradient_brightness, "transparent"],
        borderWidth: 0,
        value: brightnessValue,
        datalabels: {
          display: true,
          formatter: (value) => `${value}°C`,
        },
      },
    ],
  };

  const options_chart_brightness = {
    rotation: 270, // start angle in degrees
    circumference: 180, // sweep angle in degrees
    plugins: {
      datalabels: {
        display: true,
        backgroundColor: "white",
        borderRadius: 4,
        color: "black",
        font: {
          weight: "bold",
        },
      },
    },
    cutout: "92%",
  };
  //Soil Moisture chart
  let soil_moistureValue = 2000;
  if (sortedList) {
    const soil_moistureItem = sortedList.find(
      (item) => item.topic === "esp/ground/moisture/1"
    );
    soil_moistureValue = soil_moistureItem ? soil_moistureItem.value : 0;
  }
  const maxsoil_moistureValue = 3000;
  const greenEnd_soil_moisture = (100 / maxsoil_moistureValue) * 100;
  const yellowEnd_soil_moisture = (350 / maxsoil_moistureValue) * 100;
  const canvas_soil_moisture = document.createElement("canvas");
  const ctx_soil_moisture = canvas_soil_moisture.getContext("2d");
  const gradient_soil_moisture = ctx_soil_moisture.createLinearGradient(
    0,
    0,
    2000,
    0
  );
  gradient_soil_moisture.addColorStop(0, "darkblue");
  gradient_soil_moisture.addColorStop(greenEnd_soil_moisture / 100, "blue");
  gradient_soil_moisture.addColorStop(
    yellowEnd_soil_moisture / 100,
    "lightblue"
  );
  gradient_soil_moisture.addColorStop(1, "white");

  const adjustedsoil_moistureValue =
    (soil_moistureValue / maxsoil_moistureValue) * 100;
  const data_chart_soil_moisture = {
    datasets: [
      {
        data: [adjustedsoil_moistureValue, 100 - adjustedsoil_moistureValue],
        backgroundColor: [gradient_soil_moisture, "transparent"],
        borderWidth: 0,
        value: soil_moistureValue,
        datalabels: {
          display: true,
          formatter: (value) => `${value}°C`,
        },
      },
    ],
  };

  const options_chart_soil_moisture = {
    rotation: 270, // start angle in degrees
    circumference: 180, // sweep angle in degrees
    plugins: {
      datalabels: {
        display: true,
        backgroundColor: "white",
        borderRadius: 4,
        color: "black",
        font: {
          weight: "bold",
        },
      },
    },
    cutout: "92%",
  };
  //Pressure chart
  let pressureValue = 1100;
  if (sortedList) {
    const pressureItem = sortedList.find(
      (item) => item.topic === "esp/air/pressure"
    );
    pressureValue = pressureItem ? pressureItem.value : 0;
  }
  pressureValue = pressureValue - 700;
  const maxpressureValue = 1050;
  const greenEnd_pressure = (100 / maxpressureValue) * 100;
  const yellowEnd_pressure = (350 / maxpressureValue) * 100;
  const canvas_pressure = document.createElement("canvas");
  const ctx_pressure = canvas_pressure.getContext("2d");
  const gradient_pressure = ctx_pressure.createLinearGradient(0, 0, 2000, 0);
  gradient_pressure.addColorStop(0, "darkblue");
  gradient_pressure.addColorStop(greenEnd_pressure / 100, "blue");
  gradient_pressure.addColorStop(yellowEnd_pressure / 100, "lightblue");
  gradient_pressure.addColorStop(1, "white");

  const adjustedpressureValue = (pressureValue / maxpressureValue) * 100;
  const data_chart_pressure = {
    datasets: [
      {
        data: [adjustedpressureValue, 100 - adjustedpressureValue],
        backgroundColor: [gradient_pressure, "transparent"],
        borderWidth: 0,
        value: pressureValue,
        datalabels: {
          display: true,
          formatter: (value) => `${value}°C`,
        },
      },
    ],
  };

  const options_chart_pressure = {
    rotation: 270, // start angle in degrees
    circumference: 180, // sweep angle in degrees
    plugins: {
      datalabels: {
        display: true,
        backgroundColor: "white",
        borderRadius: 4,
        color: "black",
        font: {
          weight: "bold",
        },
      },
    },
    cutout: "92%",
  };

  //humidity chart
  let humidityValue = 30;
  if (sortedList) {
    const humidityItem = sortedList.find(
      (item) => item.topic === "esp/air/humidity"
    );
    humidityValue = humidityItem ? humidityItem.value : 0;
  }

  const maxhumidityValue = 100;
  const greenEnd_humidity = (7 / maxhumidityValue) * 100;
  const yellowEnd_humidity = (25 / maxhumidityValue) * 100;
  const canvas_humidity = document.createElement("canvas");
  const ctx_humidity = canvas_humidity.getContext("2d");
  const gradient_humidity = ctx_humidity.createLinearGradient(0, 0, 200, 0);
  gradient_humidity.addColorStop(0, "blue");
  gradient_humidity.addColorStop(greenEnd_humidity / 100, "lightblue");
  gradient_humidity.addColorStop(yellowEnd_humidity / 100, "yellow");
  gradient_humidity.addColorStop(1, "red");

  const adjustedhumidityValue = (humidityValue / maxhumidityValue) * 100;
  const data_chart_humidity = {
    datasets: [
      {
        data: [adjustedhumidityValue, 100 - adjustedhumidityValue],
        backgroundColor: [gradient_humidity, "transparent"],
        borderWidth: 0,
        value: humidityValue,
        datalabels: {
          display: true,
          formatter: (value) => `${value}°C`,
        },
      },
    ],
  };

  const options_chart_humidity = {
    rotation: 270, // start angle in degrees
    circumference: 180, // sweep angle in degrees
    plugins: {
      datalabels: {
        display: true,
        backgroundColor: "white",
        borderRadius: 4,
        color: "black",
        font: {
          weight: "bold",
        },
      },
    },
    cutout: "92%",
  };
  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Sensor Data</h1>
      <div className={styles.main_container}>
        <div className={styles.data}>
          {sortedList.map((item) => {
            if (item.topic === "esp/ground/light/lux") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <div className={styles.elementssensordata}>
                    <p className={styles.sensorheading}>Brightness</p>
                    <h2 className={styles.sensorvalue}>{item.value} lux</h2>
                    <div className={styles.doughnut}>
                      <Doughnut
                        data={data_chart_brightness}
                        options={options_chart_brightness}
                      />
                    </div>
                  </div>
                </div>
              );
            } else if (item.topic === "esp/ground/moisture/1") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <div className={styles.elementssensordata}>
                    <p className={styles.sensorheading}>Soil Moisture</p>
                    <h2 className={styles.sensorvalue}>{item.value}</h2>
                    <div className={styles.doughnut}>
                      <Doughnut
                        data={data_chart_soil_moisture}
                        options={options_chart_soil_moisture}
                      />
                    </div>
                  </div>
                </div>
              );
            } else if (item.topic === "esp/air/pressure") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <div className={styles.elementssensordata}>
                    <p className={styles.sensorheading}>Pressure</p>
                    <h2 className={styles.sensorvalue}>
                      {Number(item.value).toFixed(0)} hpa
                    </h2>

                    <div className={styles.doughnut}>
                      <Doughnut
                        data={data_chart_pressure}
                        options={options_chart_pressure}
                      />
                    </div>
                  </div>
                </div>
              );
            } else if (item.topic === "esp/air/humidity") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <div className={styles.elementssensordata}>
                    <p className={styles.sensorheading}>Humidity</p>
                    <h2 className={styles.sensorvalue}>{item.value}%</h2>
                    <div className={styles.doughnut}>
                      <Doughnut
                        data={data_chart_humidity}
                        options={options_chart_humidity}
                      />
                    </div>
                  </div>
                </div>
              );
            } else if (item.topic === "esp/air/temperature") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <div className={styles.elementssensordata}>
                    <p className={styles.sensorheading}>Temperature</p>
                    <h2 className={styles.sensorvalue}>{item.value}°C</h2>
                    <div className={styles.doughnut}>
                      <Doughnut
                        data={data_chart_temperature}
                        options={options_chart_temperature}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
      <>
        <h1 className={styles.heading}>Calendar</h1>
        <div className={styles.CalendarBox}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            events={events}
            initialView="timeGridWeek"
            height={500}
          />
        </div>
      </>

      {/*   
      //special for Enterprise clients
      {isMediumorBig? (
        <>
          <h1 className={styles.heading}>Calendar</h1>
          <div className={styles.CalendarBox}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              events={events}
              initialView="timeGridWeek"
              height={500}
            />
          </div>
        </>
      ) : (
        <h1 className={styles.heading}>Temperature Diagramm</h1>
      )} */}
    </div>
  );
};

export default Main;
