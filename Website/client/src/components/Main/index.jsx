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
import ClipLoader from "react-spinners/ClipLoader";
Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement
);
const Main = () => {
  let [list, setList] = useState([]);
  let [tempchardata, settempchardata] = useState([]);
  let [humchardata, sethumchardata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //let [luxchardata, setluxchardata] = useState([]);
  //let [allchardata, setallchardata] = useState([]);
  //let [name, setName] = useState([]);
  useEffect(() => {
    axios
      .get("http://20.219.193.229:8080/api/data/all/humidity")

      .then(function (response) {
        const dataArr = []; //const valueNameArr = []
        let counter = 0;
        for (let thing in response.data) {
          //console.log(response.data[item].location.coordinates);
          if (counter < 1000)
            dataArr.push({
              time: response.data[thing].time,
              value: response.data[thing].value,
            });
          counter++;
        }
        setIsLoading(false);
        sethumchardata(dataArr);
      });
  });
  useEffect(() => {
    axios
      .get("http://20.219.193.229:8080/api/data/all/lux")

      .then(function (response) {
        const dataArr = []; //const valueNameArr = []
        let counter = 0;
        for (let thing in response.data) {
          //console.log(response.data[item].location.coordinates);
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
        const dataArr = []; //const valueNameArr = []
        let counter = 0;
        for (let thing in response.data) {
          //console.log(response.data[item].location.coordinates);
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
      .get("http://20.219.193.229:8080/api/data/latestdata/all")
      .then(function (response) {
        const valuesArr = [];
        //const valueNameArr = []
        let counter = 0;
        for (let item in response.data) {
          //console.log(response.data[item].location.coordinates);
          if (counter < 100)
            valuesArr.push({
              topic: response.data[item].topic,

              value: response.data[item].value,
            });
          counter++;
        }
        setList(valuesArr);
      });
  });
  const decimation = {
    enabled: false,
    algorithm: "min-max",
  };
  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Sensor Data</h1>
      <div className={styles.main_container}>
        <div className={styles.data}>
          {list.map((item) => {
            if (item.topic === "esp/ground/light/lux") {
              return (
                <div className={styles.sensordata}>
                  <p key={item}>Brightness</p> <h2> {item.value} lux</h2>
                </div>
              );
            }
          })}
          {list.map((item) => {
            if (item.topic === "esp/ground/moisture/1") {
              return (
                <div className={styles.sensordata}>
                  <p key={item}>Soil Moisture</p> <h2> {item.value}</h2>
                </div>
              );
            }
          })}
          {list.map((item) => {
            if (item.topic === "esp/air/pressure") {
              return (
                <div className={styles.sensordata}>
                  <p key={item}>Pressure</p> <h2> {item.value} hpa</h2>
                </div>
              );
            }
          })}
          {list.map((item) => {
            if (item.topic === "esp/air/humidity") {
              return (
                <div className={styles.sensordata}>
                  <p key={item}>Humidity </p> <h2> {item.value}%</h2>
                </div>
              );
            }
          })}
          {list.map((item) => {
            if (item.topic === "esp/air/temperature") {
              return (
                <div className={styles.sensordata}>
                  <p key={item}>Temperature </p> <h2> {item.value}°C</h2>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div>
        {!isLoading ? (
          <div>
            <h2 className={styles.heading}>Temperatur Diagramm</h2>
            <div className={styles.graph}>
              <Line
                data={{
                  labels: tempchardata.map((tempchardata) => tempchardata.time),
                  title: {
                    text: "Chart with Animation Enabled",
                  },
                  datasets: [
                    {
                      label: "Large Dataset",
                      data: tempchardata.map(
                        (tempchardata) => tempchardata.value
                      ), //[20,10,30],                data.map((data) => [data.value]),
                      borderColor: ["rgba(237, 150, 190, 1)"],
                    },
                    {
                      label: "Large Dataset",
                      data: humchardata.map((humchardata) => humchardata.value), //[20,10,30],                data.map((data) => [data.value]),
                      borderColor: ["rgba(255, 99, 132, 1)"],
                    },
                  ],
                }}
                options={{
                  animation: false,
                  plugins: {
                    title: {
                      display: true,
                      text: "Cryptocurrency prices",
                    },
                    legend: {
                      display: true,
                      position: "bottom",
                    },
                    plugins: {
                      decimation: decimation,
                    },
                    interaction: {
                      mode: "nearest",
                      axis: "x",
                      intersect: false,
                    },
                    scales: {
                      x: {
                        type: "time",
                        ticks: {
                          source: "auto",
                          // Disabled rotation for performance
                          maxRotation: 0,
                          autoSkip: true,
                          reverse: true,
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <div className={styles.loading}>
            <ClipLoader size={150} />
          </div>
        )}
      </div>
    </div>
  );
};
//{selected.map((item) => {
//  if ((item.selected = "Temperatur")) {
//    <div>
//      <h2 className={styles.heading}>Temperatur Diagramm</h2>
//      <div className={styles.graph}>
//        <Line
//          key={tempchardata}
//          data={{
//            labels: tempchardata.map(
//              (tempchardata) => tempchardata.time
//            ),
//
//            datasets: [
//              {
//                label: "Dataset 1",
//
//                data: tempchardata.map(
//                  (tempchardata) => tempchardata.value
//                ), //[20,10,30],                data.map((data) => [data.value]),
//                backgroundColor: ["rgba(255, 99, 132, 0.2)"],
//                borderColor: ["rgba(255, 99, 132, 1)"],
//              },
//            ],
//          }}
//        />
//      </div>
//    </div>;
//  }
//})}
//;
//let [selected, setselected] = useState([]);
//useEffect(() => {
//  const selectArr = [];
//  selectArr.push({
//    selected: "clear",
//  });
//
//  setselected(selectArr);
//});
//to much of them
//{list.map((item) => {
//  if (item.topic === "esp/ground/moisture/3") {
//    return (
//      <div className={styles.sensordata}>
//        <p key={item}>Moisture 3 </p> <h2> {item.value}</h2>
//      </div>
//    );
//  }
//})}
//{list.map((item) => {
//  if (item.topic === "esp/ground/moisture/2") {
//    return (
//      <div className={styles.sensordata}>
//        <p key={item}>Moisture 2 </p> <h2> {item.value}</h2>
//      </div>
//    );
//  }
//})}
//{list.map((item) => {
//  if (item.topic === "esp/ground/light/clear") {
//    return (
//      <div className={styles.sensordata}>
//        <p key={item}>Clear </p> <h2> {item.value}</h2>
//      </div>
//    );
//  }
//})}
//{list.map((item) => {
//  if (item.topic === "esp/ground/light/blue") {
//    return (
//      <div className={styles.sensordata}>
//        <p key={item}>Blue </p> <h2> {item.value}</h2>
//      </div>
//    );
//  }
//})}
//{list.map((item) => {
//  if (item.topic === "esp/ground/light/green") {
//    return (
//      <div className={styles.sensordata}>
//        <p key={item}>Green </p> <h2> {item.value}</h2>
//      </div>
//    );
//  }
//})}
//{list.map((item) => {
//  if (item.topic === "esp/ground/light/red") {
//    return (
//      <div className={styles.sensordata}>
//        <p key={item}>Red </p> <h2> {item.value}</h2>
//      </div>
//    );
//  }
//})}
export default Main;
