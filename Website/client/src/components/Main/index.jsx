import styles from "./styles.module.css";
import { Doughnut } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "chartjs-adapter-moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
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

const apiUrl = process.env.REACT_APP_API_URL;
const Main = () => {
  let [list, setList] = useState([]);
  let [list2, setList2] = useState([]);
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  const groupId = localStorage.getItem("groupId");
  const [rightabo, setRightabo] = useState(false);
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  // Use another effect hook to dispatch changeRoute when the component mounts
  useEffect(() => {
    dispatch(changeRoute("/"));
  }, [dispatch]); // Re-run the effect if dispatch changes
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

  const events = [
    ...list2
      .filter((item2) => item2.ignore !== "true")
      .map((item2) => ({
        title: item2.message,
        category: "time",
        start: item2.time,
        end: item2.time,
      })),
  ];
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
  // Combine useEffect hooks
  useEffect(() => {
    if (currentPage === "/") {
      fetchData_notification();
      const interval_notification = setInterval(fetchData_notification, 5000);

      fetchData_abo();
      const interval_abo = setInterval(fetchData_abo, 10000);

      fetchData();
      const interval_data = setInterval(fetchData, 5000);

      return () => {
        clearInterval(interval_notification);
        clearInterval(interval_abo);
        clearInterval(interval_data);
      };
    }
  }, [currentPage]);
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
  // Dann können Sie die Funktion wie folgt verwenden:
  const chartConfig = {
    "esp/air/temperature": {
      maxValue: 40,
      greenEnd: 7,
      yellowEnd: 30,
      colors: ["lightblue", "green", "yellow", "red"],
      heading: "Air Temperature",
      unit: "°C",
    },
    "esp/ground/light/lux": {
      maxValue: 2000,
      greenEnd: 10,
      yellowEnd: 150,
      colors: ["black", "blue", "lightblue", "white"],
      heading: "Lux",
      unit: "lux",
    },
    "esp/ground/moisture/1": {
      maxValue: 3000,
      greenEnd: 100,
      yellowEnd: 350,
      colors: ["darkblue", "blue", "lightblue", "white"],
      heading: "Moisture",
      unit: "",
    },
    "esp/air/pressure": {
      maxValue: 300,
      greenEnd: 250,
      yellowEnd: 50,
      colors: ["darkblue", "blue", "lightblue", "white"],
      heading: "Pressure",
      unit: "hPa",
    },
    "esp/air/humidity": {
      maxValue: 100,
      greenEnd: 7,
      yellowEnd: 25,
      colors: ["blue", "lightblue", "yellow", "red"],
      heading: "Humidity",
      unit: "%",
    },
  };

  function createChart(sortedList, topic, config) {
    const { maxValue, colors } = config;
    let value = 0;
    if (sortedList) {
      const item = sortedList.find((item) => item.topic === topic);
      value = item ? item.value : 0;
    }

    const gradient = ctx.createLinearGradient(0, 0, 200, 0);
    colors.forEach((color, index) => {
      const stop = index / (colors.length - 1);
      gradient.addColorStop(stop, color);
    });

    const adjustedValue = (value / maxValue) * 100;
    const data_chart = {
      datasets: [
        {
          data: [adjustedValue, 100 - adjustedValue],
          backgroundColor: [gradient, "transparent"],
          borderWidth: 0,
          value: value,
          datalabels: {
            display: true,
          },
        },
      ],
    };

    const options_chart = {
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

    return { data_chart, options_chart };
  }

  function renderChart(item, config) {
    const { heading, unit } = config;
    const { data_chart: dataChart, options_chart: optionsChart } = createChart(
      sortedList,
      item.topic,
      config
    );
    return (
      <div className={styles.sensordata} key={item.topic}>
        <div className={styles.elementssensordata}>
          <p className={styles.sensorheading}>{heading}</p>
          <h2 className={styles.sensorvalue}>
            {item.value} {unit}
          </h2>
          <div className={styles.doughnut}>
            <Doughnut data={dataChart} options={optionsChart} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Sensor Data</h1>
      <div className={styles.main_container}>
        <div className={styles.data}>
          {sortedList
            .filter((item) => chartConfig[item.topic])
            .map((item) => renderChart(item, chartConfig[item.topic]))}
        </div>
      </div>
      <>
        <h1 className={styles.heading}>Calendar</h1>
        <div className={styles.CalendarBox}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            events={events}
            initialView="timeGridWeek"
            height={1300}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
          />
        </div>
        <div className={styles.space}></div>
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
