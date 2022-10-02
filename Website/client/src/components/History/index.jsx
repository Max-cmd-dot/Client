import styles from "./styles.module.css";
import { Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
import React, { useState, useEffect } from "react";
import axios from "axios";

Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement
);

const History = () => {
  let [tempchardata, settempchardata] = useState([]);
  let [humchardata, sethumchardata] = useState([]);
  useEffect(() => {
    axios
      .get("http://20.219.193.229:8080/api/data/all/humidity")
      .then(function (response) {
        const dataArr = [];
        let counter = 0;
        for (let thing in response.data) {
          if (counter < 1000)
            dataArr.push({
              time: response.data[thing].time,
              value: response.data[thing].value,
            });
          counter++;
        }
        sethumchardata(dataArr);
      });
  });
  useEffect(() => {
    axios
      .get("http://20.219.193.229:8080/api/data/all/lux")
      .then(function (response) {
        const dataArr = [];
        let counter = 0;
        for (let thing in response.data) {
          if (counter < 1000)
            dataArr.push({
              time: response.data[thing].time,
              value: response.data[thing].value,
            });
          counter++;
        }
        setluxchardata(dataArr);
      });
  });
  useEffect(() => {
    axios
      .get("http://20.219.193.229:8080/api/data/all/temperature")
      .then(function (response) {
        const dataArr = [];
        let counter = 0;
        for (let thing in response.data) {
          if (counter < 1000)
            dataArr.push({
              time: response.data[thing].time,
              value: response.data[thing].value,
            });
          counter++;
        }
        settempchardata(dataArr);
      });
  });
  return (
    <>
      <div className={styles.main_container}>
        <h1 className={styles.heading}>History</h1>
        <div>
          <h2 className={styles.heading}>Temperatur Diagramm</h2>
          <div className={styles.graph}>
            <Line
              data={{
                labels: tempchardata.map((tempchardata) => tempchardata.time),
                datasets: [
                  {
                    label: "Dataset 1",
                    data: tempchardata.map(
                      (tempchardata) => tempchardata.value
                    ),
                    backgroundColor: ["rgba(37, 150, 190, 0.2)"],
                    borderColor: ["rgba(237, 150, 190, 1)"],
                  },
                ],
              }}
            />
          </div>
        </div>
        <div>
          <h2 className={styles.heading}>Temperatur Diagramm</h2>
          <div className={styles.graph}>
            <Line
              data={{
                labels: tempchardata.map((tempchardata) => tempchardata.time),
                datasets: [
                  {
                    label: "Dataset 1",
                    data: tempchardata.map(
                      (tempchardata) => tempchardata.value
                    ),
                    backgroundColor: ["rgba(37, 150, 190, 0.2)"],
                    borderColor: ["rgba(237, 150, 190, 1)"],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default History;
