import styles from "./styles.module.css";
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "chartjs-adapter-moment";
import Calendar from "@toast-ui/react-calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
import toast, { Toaster } from "react-hot-toast";
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
const Main = () => {
  let [list, setList] = useState([]);
  const groupId = localStorage.getItem("groupId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://20.219.193.229:8080/api/data/latestdata/all?groupId=${groupId}`
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
        setList(valuesArr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const calendars = [{ id: "cal1", name: "Personal" }];
  const initialEvents = [
    {
      id: "1",
      calendarId: "cal2",
      title: "Bereich 1 gießen",
      category: "time",
      start: "2023-05-26T12:00:00",
      end: "2023-05-26T13:30:00",
    },
    {
      id: "2",
      calendarId: "cal1",
      title: "Bereich 2 Pflanzen",
      category: "time",
      start: "2023-05-24T15:00:00",
      end: "2023-05-27T15:30:00",
      backgroundColor: "lightblue",
    },
    {
      id: "3",
      calendarId: "cal1",
      title: "Bereich 1 Pflanzen",
      category: "time",
      start: "2023-05-07T15:00:00",
      end: "2023-05-13T15:30:00",
      backgroundColor: "orange",
    },
    {
      id: "4",
      calendarId: "cal1",
      title: "Bereich 1 ernten",
      category: "time",
      start: "2023-06-04T15:00:00",
      end: "2023-06-06T15:30:00",
    },
  ];
  const options = [
    {
      useFormPopup: true,
      useDetailPopup: true,
    },
  ];
  /*const notify = () => toast("Here is your toast.");
  <div>
        {notify()}
        <Toaster />
      </div>
  */

  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Sensor Data</h1>
      <div className={styles.main_container}>
        <div className={styles.data}>
          {list.map((item) => {
            if (item.topic === "esp/ground/light/lux") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <p>Brightness</p>
                  <h2>{item.value} lux</h2>
                </div>
              );
            } else if (item.topic === "esp/ground/moisture/1") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <p>Soil Moisture</p>
                  <h2>{item.value}</h2>
                </div>
              );
            } else if (item.topic === "esp/air/pressure") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <p>Pressure</p>
                  <h2>{item.value} hpa</h2>
                </div>
              );
            } else if (item.topic === "esp/air/humidity") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <p>Humidity</p>
                  <h2>{item.value}%</h2>
                </div>
              );
            } else if (item.topic === "esp/air/temperature") {
              return (
                <div className={styles.sensordata} key={item.topic}>
                  <p>Temperature</p>
                  <h2>{item.value}°C</h2>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className={styles.CalendarBox}>
        <Calendar
          view="month"
          calendars={calendars}
          events={initialEvents}
          styles={styles.CalendarBox}
        />
      </div>
    </div>
  );
};

export default Main;
