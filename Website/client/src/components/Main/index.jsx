import styles from "./styles.module.css";
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "chartjs-adapter-moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
const apiUrl = process.env.REACT_APP_API_URL;
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
const Main = () => {
  let [list, setList] = useState([]);
  let [list2, setList2] = useState([]);
  const groupId = localStorage.getItem("groupId");
  const [rightabo, setRightabo] = useState(false);

  const [value, onChange] = useState(new Date());
  useEffect(() => {
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
    const interval = setInterval(fetchData_abo, 100000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
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
  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Sensor Data</h1>
      <div className={styles.main_container}>
        <div className={styles.data}>
          {sortedList.map((item) => {
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
      {isMediumOrBig ? (
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
      )}
    </div>
  );
};

export default Main;
