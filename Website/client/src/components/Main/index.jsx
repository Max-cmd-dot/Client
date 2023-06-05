import styles from "./styles.module.css";
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import "chartjs-adapter-moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const apiUrl = process.env.REACT_APP_API_URL;

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
  const [rightabo, setRightabo] = useState(false);

  const [value, onChange] = useState(new Date());
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/group/abo?group=${groupId}`
        );
        setRightabo(response.data.package);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 100000);

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
        console.log(response);
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

  const isMediumOrBig = rightabo === "medium" || rightabo === "big";

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
      {isMediumOrBig ? (
        <>
          <h1 className={styles.heading}>Calendar</h1>
          <div className={styles.CalendarBox}>
            <Calendar
              view="month"
              calendars={calendars}
              events={initialEvents}
              options={options}
              styles={styles.CalendarBox}
              onChange={onChange}
              value={value}
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
