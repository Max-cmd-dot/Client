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
  let [luxchardata, setluxchardata] = useState([]);
  let [moi1chardata, setmoi1chardata] = useState([]);
  let [moi2chardata, setmoi2chardata] = useState([]);
  let [moi3chardata, setmoi3chardata] = useState([]);
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
  useEffect(() => {
    axios
      .get("http://20.219.193.229:8080/api/data/all/moisture/1")
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
        setmoi1chardata(dataArr);
      });
  });
  useEffect(() => {
    axios
      .get("http://20.219.193.229:8080/api/data/all/moisture/2")
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
        setmoi2chardata(dataArr);
      });
  });
  useEffect(() => {
    axios
      .get("http://20.219.193.229:8080/api/data/all/moisture/3")
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
        setmoi3chardata(dataArr);
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
                    borderColor: ["rgba(237, 150, 190, 1)"],
                  },
                ],
              }}
            />
          </div>
        </div>
        <div>
          <h2 className={styles.heading}>Brightness Diagramm (Lux)</h2>
          <div className={styles.graph}>
            <Line
              data={{
                labels: luxchardata.map((luxchardata) => luxchardata.time),
                datasets: [
                  {
                    label: "Dataset 1",
                    data: luxchardata.map((luxchardata) => luxchardata.value),
                    borderColor: ["rgba(237, 150, 190, 1)"],
                  },
                ],
              }}
            />
          </div>
        </div>
        <div>
          <h2 className={styles.heading}>Humdity Diagramm</h2>
          <div className={styles.graph}>
            <Line
              data={{
                labels: humchardata.map((humchardata) => humchardata.time),
                datasets: [
                  {
                    label: "Dataset 1",
                    data: humchardata.map((humchardata) => humchardata.value),
                    borderColor: ["rgba(237, 150, 190, 1)"],
                  },
                ],
              }}
            />
          </div>
        </div>
        <div>
          <h2 className={styles.heading}>Moisture Diagramm</h2>
          <div className={styles.graph}>
            <Line
              data={{
                labels: moi1chardata.map((moi1chardata) => moi1chardata.time),
                datasets: [
                  {
                    label: "Dataset 2",
                    data: moi2chardata.map(
                      (moi2chardata) => moi2chardata.value
                    ),
                    borderColor: ["rgba(220, 250, 190, 1)"],
                  },
                  {
                    label: "Dataset 3",
                    data: moi3chardata.map(
                      (moi3chardata) => moi3chardata.value
                    ),
                    borderColor: ["rgba(200, 50, 190, 1)"],
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
