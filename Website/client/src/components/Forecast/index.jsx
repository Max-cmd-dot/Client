import styles from "./styles.module.css";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ButtonGroup from "../ButtonGroup/button-group";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
} from "chart.js";
import DatePicker from "../DatePicker/DatePicker";
Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale
);

const apiUrl = process.env.REACT_APP_API_URL;
const Forecast = () => {
  let [tempchardata, settempchardata] = useState([]);
  let [humchardata, sethumchardata] = useState([]);
  let [brightchardata, setbrightchardata] = useState([]);
  const groupId = localStorage.getItem("groupId");
  const [isLoading_chart_1, setIsLoading_chart_1] = useState(false);
  const [loadingTime_1, setLoadingTime_1] = useState(false);
  const [update_interval_value_chart_1, setupdate_interval_value_chart_1] =
    useState(15000);
  const [count_chart_1, setcount_chart_1] = useState(1000);
  const [charttype, setcharttype] = useState("temperature");
  const handleButtonTemperature = () => {
    setcharttype("temperature");
  };
  const handleHumidity = () => {
    setcharttype("humidity");
  };
  const handleLux = () => {
    setcharttype("lux");
  };
  const printButtonLabel = (event) => {
    if (event.target.name === "Temperature") {
      handleButtonTemperature();
    }
    if (event.target.name === "Humidity") {
      handleHumidity();
    }
    if (event.target.name === "Brightness") {
      handleLux();
    }
  };
  useEffect(() => {
    let isMounted = true;
    const fetchdata_chart_1 = async () => {
      try {
        setLoadingTime_1(Date.now());

        const checkboxPromise_Temperature = [];
        checkboxPromise_Temperature.push(
          axios.get(
            `${apiUrl}/api/data/all/temperature?groupId=${groupId}&count=${count_chart_1}`
          )
        );
        const response_Temperature = await Promise.all(
          checkboxPromise_Temperature
        );

        const temperatureDataArr = [];
        let countertemperature = 0;
        for (let thing in response_Temperature[0].data) {
          if (countertemperature < 10000) {
            temperatureDataArr.push({
              time: response_Temperature[0].data[thing].time,
              value: response_Temperature[0].data[thing].value,
            });
            countertemperature++;
          }
        }
        const reversedtemperatureDataArr = temperatureDataArr.reverse();

        if (isMounted) {
          settempchardata(reversedtemperatureDataArr);
        }

        console.log("Temperature T");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          const elapsedTime = Date.now() - loadingTime_1;
          if (elapsedTime > 100) {
            setIsLoading_chart_1(true);
          }
        }
      }
    };
    const fetchdata_chart_2 = async () => {
      try {
        setLoadingTime_1(Date.now());

        const checkboxPromise_Brightness = [];
        checkboxPromise_Brightness.push(
          axios.get(
            `${apiUrl}/api/data/all/lux?groupId=${groupId}&count=${count_chart_1}`
          )
        );
        const response_Brightness = await Promise.all(
          checkboxPromise_Brightness
        );

        const BrightnessDataArr = [];
        let counterBrightness = 0;
        for (let thing in response_Brightness[0].data) {
          if (counterBrightness < 10000) {
            BrightnessDataArr.push({
              time: response_Brightness[0].data[thing].time,
              value: response_Brightness[0].data[thing].value,
            });
            counterBrightness++;
          }
        }
        const reversedBrightnessDataArr = BrightnessDataArr.reverse();

        if (isMounted) {
          setbrightchardata(reversedBrightnessDataArr);
        }
        console.log("Brightness T");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          const elapsedTime = Date.now() - loadingTime_1;
          if (elapsedTime > 100) {
            setIsLoading_chart_1(true);
          }
        }
      }
    };
    const fetchdata_chart_3 = async () => {
      try {
        setLoadingTime_1(Date.now());

        const checkboxPromise_Humidity = [];
        checkboxPromise_Humidity.push(
          axios.get(
            `${apiUrl}/api/data/all/Humidity?groupId=${groupId}&count=${count_chart_1}`
          )
        );
        const response_Humidity = await Promise.all(checkboxPromise_Humidity);

        const HumidityDataArr = [];
        let counterHumidity = 0;
        for (let thing in response_Humidity[0].data) {
          if (counterHumidity < 10000) {
            HumidityDataArr.push({
              time: response_Humidity[0].data[thing].time,
              value: response_Humidity[0].data[thing].value,
            });
            counterHumidity++;
          }
        }
        const reversedHumidityDataArr = HumidityDataArr.reverse();

        if (isMounted) {
          sethumchardata(reversedHumidityDataArr);
        }

        console.log("Humidity T");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          const elapsedTime = Date.now() - loadingTime_1;
          if (elapsedTime > 100) {
            setIsLoading_chart_1(true);
          }
        }
      }
    };
    if (charttype === "temperature") {
      fetchdata_chart_1();
      console.log(charttype);
    }
    if (charttype === "humidity") {
      fetchdata_chart_2();
      console.log(charttype);
    }
    if (charttype === "lux") {
      fetchdata_chart_3();
      console.log(charttype);
    }

    const interval_chart_1 = setInterval(
      fetchdata_chart_1,
      update_interval_value_chart_1
    );
    const interval_chart_2 = setInterval(
      fetchdata_chart_2,
      update_interval_value_chart_1
    );
    const interval_chart_3 = setInterval(
      fetchdata_chart_3,
      update_interval_value_chart_1
    );
    return () => {
      isMounted = false;
      if (charttype === "temperature") {
        clearInterval(interval_chart_1);
      }
      if (charttype === "humidity") {
        clearInterval(interval_chart_2);
      }
      if (charttype === "lux") {
        clearInterval(interval_chart_3);
      }
    };
  }, [, update_interval_value_chart_1, count_chart_1, charttype]);
  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return (Math.round(m) / 100) * Math.sign(num);
  }
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const startOfDayInMilliseconds = startOfDay.getTime();
  const endOfDayInMilliseconds = endOfDay.getTime();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.h1}>Forecast</h1>
        <div className={styles.buttonGroup}>
          <DatePicker />
        </div>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            buttons={["Temperature", "Brightness", "Humidity"]}
            doSomethingAfterClick={printButtonLabel}
            defaultActiveButton={0}
          />
        </div>
        <div className={styles.diagramm}>
          {charttype === "temperature" ? (
            <div>
              {isLoading_chart_1 ? (
                <div className={styles.chart_container}>
                  <div style={{ margin: "2%" }}>
                    <Line
                      data={{
                        labels: tempchardata.map(
                          (tempchardata) => tempchardata.time
                        ),
                        datasets: [
                          {
                            label: "tempchardata",
                            data: tempchardata.map(
                              (tempchardata) => tempchardata.value
                            ),
                            borderColor: ["rgba(0, 0, 237, 1)"],
                          },
                        ].filter(Boolean),
                      }}
                      options={{
                        animation: false,
                        pointRadius: 1,
                        interaction: {
                          intersect: false,
                          mode: "index",
                        },
                        tooltips: {
                          enabled: true, // enable tooltips
                          callbacks: {
                            // customize tooltip content
                            label: (context) => {
                              const datasetLabel = context.dataset.label || "";
                              const value = context.parsed.y;
                              return `${datasetLabel}: ${value}`;
                            },
                          },
                        },
                        scales: {
                          x: {
                            type: "time",
                            time: {
                              displayFormats: {
                                hour: "HH",
                              },
                            },
                            ticks: {
                              source: "auto",
                              // Disabled rotation for performance
                              maxRotation: 0,
                              autoSkip: true,
                              reverse: true,
                            },
                            min: startOfDayInMilliseconds,
                            max: endOfDayInMilliseconds,
                          },
                          y: {
                            ticks: {
                              callback: function (value, index, ticks) {
                                return round(value) + " °C";
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
                  <ClipLoader size={50} className={styles.heading} />
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
          {charttype === "humidity" ? (
            <div>
              {isLoading_chart_1 ? (
                <div className={styles.chart_container}>
                  <div style={{ margin: "2%" }}>
                    <Line
                      data={{
                        labels: humchardata.map(
                          (humchardata) => humchardata.time
                        ),
                        datasets: [
                          {
                            label: "humchardata",
                            data: humchardata.map(
                              (humchardata) => humchardata.value
                            ),
                            borderColor: ["rgba(0, 0, 237, 1)"],
                          },
                        ].filter(Boolean),
                      }}
                      options={{
                        animation: false,
                        pointRadius: 1,
                        interaction: {
                          intersect: false,
                          mode: "index",
                        },
                        tooltips: {
                          enabled: true, // enable tooltips
                          callbacks: {
                            // customize tooltip content
                            label: (context) => {
                              const datasetLabel = context.dataset.label || "";
                              const value = context.parsed.y;
                              return `${datasetLabel}: ${value}`;
                            },
                          },
                        },
                        scales: {
                          x: {
                            type: "time",
                            time: {
                              displayFormats: {
                                hour: "HH",
                              },
                            },
                            ticks: {
                              source: "auto",
                              // Disabled rotation for performance
                              maxRotation: 0,
                              autoSkip: true,
                              reverse: true,
                            },
                            min: startOfDayInMilliseconds,
                            max: endOfDayInMilliseconds,
                          },
                          y: {
                            ticks: {
                              callback: function (value, index, ticks) {
                                return round(value) + " %";
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
                  <ClipLoader size={50} className={styles.heading} />
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
          {charttype === "lux" ? (
            <div>
              {isLoading_chart_1 ? (
                <div className={styles.chart_container}>
                  <div style={{ margin: "2%" }}>
                    <Line
                      data={{
                        labels: brightchardata.map(
                          (brightchardata) => brightchardata.time
                        ),
                        datasets: [
                          {
                            label: "brightchardata",
                            data: brightchardata.map(
                              (brightchardata) => brightchardata.value
                            ),
                            borderColor: ["rgba(0, 0, 237, 1)"],
                          },
                        ].filter(Boolean),
                      }}
                      options={{
                        animation: false,
                        pointRadius: 1,
                        interaction: {
                          intersect: false,
                          mode: "index",
                        },
                        tooltips: {
                          enabled: true, // enable tooltips
                          callbacks: {
                            // customize tooltip content
                            label: (context) => {
                              const datasetLabel = context.dataset.label || "";
                              const value = context.parsed.y;
                              return `${datasetLabel}: ${value}`;
                            },
                          },
                        },
                        scales: {
                          x: {
                            type: "time",
                            time: {
                              displayFormats: {
                                hour: "HH",
                              },
                            },
                            ticks: {
                              source: "auto",
                              // Disabled rotation for performance
                              maxRotation: 0,
                              autoSkip: true,
                              reverse: true,
                            },
                            min: startOfDayInMilliseconds,
                            max: endOfDayInMilliseconds,
                          },
                          y: {
                            ticks: {
                              callback: function (value, index, ticks) {
                                return round(value) + " lux";
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
                  <ClipLoader size={50} className={styles.heading} />
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecast;
