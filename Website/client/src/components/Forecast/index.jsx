import styles from "./styles.module.css";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ButtonGroup from "../ButtonGroup/button-group";
import { changeRoute } from "../../reduxStore";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import DatePicker from "../DatePicker/DatePicker";
Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend
);
import { useSelector, useDispatch } from "react-redux";
//generell
const groupId = localStorage.getItem("groupId");
const apiUrl = process.env.REACT_APP_API_URL;
const Forecast = () => {
  // Define state variables for the chart data and also the checks if they are empty
  let [tempchardata, settempchardata] = useState([]);
  const [IsDataTempDBEmpty, setIsDataTempDBEmpty] = useState(true);
  let [humchardata, sethumchardata] = useState([]);
  const [IsDataHumDBEmpty, setIsDataHumDBEmpty] = useState(true);
  let [brightchardata, setbrightchardata] = useState([]);
  const [IsDataBrightDBEmpty, setIsDataBrightDBEmpty] = useState(true);
  //forcast
  let [tempcharforecast, settempcharforecast] = useState([]);
  const [IsDataTempForecastEmpty, setIsDataTempForecastEmpty] = useState(false);
  //loading and time
  const [isLoading_chart_1, setIsLoading_chart_1] = useState(false);
  const [isLoading_chart_2, setIsLoading_chart_2] = useState(false);
  const [isLoading_chart_3, setIsLoading_chart_3] = useState(false);
  const [loadingTime_1, setLoadingTime_1] = useState(false);
  const [loadingTime_2, setLoadingTime_2] = useState(false);
  const [loadingTime_3, setLoadingTime_3] = useState(false);
  const [update_interval_value_chart_1, setupdate_interval_value_chart_1] =
    useState(15000);
  const [update_interval_value_chart_2, setupdate_interval_value_chart_2] =
    useState(15000);
  const [update_interval_value_chart_3, setupdate_interval_value_chart_3] =
    useState(15000);
  const [count_chart_1, setcount_chart_1] = useState(20000);
  const [charttype, setcharttype] = useState("Temperature");
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();

  const handleButtonTemperature = () => {
    setcharttype("Temperature");
  };
  const handleHumidity = () => {
    setcharttype("Humidity");
  };
  const handleLux = () => {
    setcharttype("Brightness");
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

  // Use another effect hook to dispatch changeRoute when the component mounts
  useEffect(() => {
    dispatch(changeRoute("/forecast"));
  }, [dispatch]); // Re-run the effect if dispatch changes
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

  // Use an effect hook to run the function every 15 seconds if currentPage is /forecast
  useEffect(() => {
    if (currentPage === "/forecast") {
      // Call the function once when the component mounts
      const fetchdata_chart_1 = async () => {
        try {
          setLoadingTime_1(Date.now());
          const checkboxPromise_Temperature = [];
          checkboxPromise_Temperature.push(
            axios.get(
              `${apiUrl}/api/data/tem?groupId=${groupId}&count=${count_chart_1}`
            )
          );

          const response_Temperature = await Promise.all(
            checkboxPromise_Temperature
          );
          const temperatureDataArr = [];
          let countertemperature = 0;
          for (let thing in response_Temperature[0].data) {
            if (countertemperature < 10000) {
              const date = new Date(
                response_Temperature[0].data[thing].data.time
              );
              const formattedDate = `${date.getFullYear()}-${
                date.getMonth() + 1
              }-${date.getDate()} ${date.getHours()}:00`;
              temperatureDataArr.push({
                time: formattedDate,
                value: response_Temperature[0].data[thing].data.value,
              });
              countertemperature++;
            }
          }
          const reversedtemperatureDataArr = temperatureDataArr.reverse();

          // Convert times to weather API format
          const convertedTimes = reversedtemperatureDataArr.map((data) => {
            const date = new Date(data.time);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            return `${year}-${month}-${day} ${hours}:${minutes}`;
          });

          // Filter data for current day
          const now = new Date();
          const currentDayData = reversedtemperatureDataArr.filter(
            (data, index) =>
              new Date(convertedTimes[index]).toDateString() ===
              now.toDateString()
          );
          // Filter past data for current day
          const pastCurrentDayData = currentDayData.filter(
            (data, index) => new Date(convertedTimes[index]) < now
          );
          // Subtract 1 hour from the time of the past data for current day
          const updatedpastCurrentDayData = pastCurrentDayData.map((data) => {
            const date = new Date(data.time);
            date.setHours(date.getHours() - 0);
            return {
              ...data,
              time: date.toISOString(),
            };
          });
          if (updatedpastCurrentDayData.length === 0) {
            setIsDataTempDBEmpty(true);
          }

          // Use past data for current day as labels for the chart
          // Create an array with all hours of the current day
          const allHours = Array.from({ length: 24 }, (_, i) => {
            const date = new Date();
            date.setHours(i);
            date.setMinutes(0);
            date.setSeconds(0);
            return `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")} ${date
              .getHours()
              .toString()
              .padStart(2, "0")}:00`;
          });

          // Map over all hours and replace the ones that exist in your data
          const filledData = allHours.map((hour) => {
            const dataAtHour = updatedpastCurrentDayData.find((data) => {
              const date = new Date(hour);
              date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
              const formattedTime = `${date.getUTCFullYear()}-${(
                date.getUTCMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${date
                .getUTCDate()
                .toString()
                .padStart(2, "0")}T${date
                .getUTCHours()
                .toString()
                .padStart(2, "0")}:00:00.000Z`;
              return formattedTime === data.time;
            });
            return dataAtHour ? dataAtHour : { time: hour, temp_c: NaN };
          });

          settempchardata(filledData);

          // Fetch data from weather API
          const weatherResponse = await axios.get(
            "http://api.weatherapi.com/v1/forecast.json?key=d50cfcc0887343f39cf193820230409&q=Hamburg&days=3&aqi=no&alerts=no"
          );
          const weatherData = weatherResponse.data;
          if (!weatherResponse || Object.keys(weatherData).length === 0) {
            throw new Error("The response from the weather API is empty");
          }
          // Check for errors and empty data
          if (weatherData.error) {
            setIsDataTempForecastEmpty(true);
            throw new Error(weatherData.error.message);
          }
          // Put weather data into an array
          const weatherDataArray = [];
          for (let day of weatherData.forecast.forecastday) {
            for (let hour of day.hour) {
              weatherDataArray.push({
                time: hour.time,
                temp_c: hour.temp_c,
              });
            }
          }

          // Filter data for current day
          const currentDayWeatherData = weatherDataArray.filter(
            (data) => new Date(data.time).toDateString() === now.toDateString()
          );

          // Filter future data for current day
          const futureCurrentDayWeatherData = currentDayWeatherData.filter(
            (data) => new Date(data.time) > now
          );

          // Generate all hours of the current day
          const allHours2 = Array.from({ length: 24 }, (_, i) => {
            const date = new Date();
            date.setHours(i, 0, 0, 0);
            return date.toISOString().split(":")[0] + ":00";
          });

          // Map over all hours to create filledFutureData
          const filledFutureData = allHours2.map((hour) => {
            const hourDate = new Date(hour);
            const dataAtHour = futureCurrentDayWeatherData.find((data) => {
              const dataDate = new Date(data.time);
              return (
                dataDate.getUTCFullYear() === hourDate.getUTCFullYear() &&
                dataDate.getUTCMonth() === hourDate.getUTCMonth() &&
                dataDate.getUTCDate() === hourDate.getUTCDate() &&
                dataDate.getUTCHours() === hourDate.getUTCHours()
              );
            });
            return dataAtHour ? dataAtHour : { time: hour, temp_c: NaN };
          });

          settempcharforecast(filledFutureData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          const elapsedTime = Date.now() - loadingTime_1;
          if (elapsedTime > 100) {
            setIsLoading_chart_1(true);
          }
        }
      };

      const fetchdata_chart_2 = async () => {
        try {
          setLoadingTime_2(Date.now());

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

          setbrightchardata(reversedBrightnessDataArr);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          const elapsedTime = Date.now() - loadingTime_2;
          if (elapsedTime > 100) {
            setIsLoading_chart_2(true);
          }
        }
      };
      const fetchdata_chart_3 = async () => {
        try {
          setLoadingTime_3(Date.now());

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

          sethumchardata(reversedHumidityDataArr);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          const elapsedTime = Date.now() - loadingTime_3;
          if (elapsedTime > 100) {
            setIsLoading_chart_3(true);
          }
        }
      };

      // Define a variable to store the function to fetch
      let fetchFunction;

      // Check the value of charttype and assign the corresponding function to fetchFunction
      switch (charttype) {
        case "Temperature":
          fetchFunction = fetchdata_chart_1;
          break;
        case "Humidity":
          fetchFunction = fetchdata_chart_2;
          break;
        case "Brightness":
          fetchFunction = fetchdata_chart_3;
          break;
        default:
          break;
      }

      // Call the function once when the component mounts
      fetchFunction();

      const interval = setInterval(fetchFunction, 1800000);

      // Return a cleanup function that clears the interval
      return () => clearInterval(interval);
    }
  }, [currentPage, charttype, IsDataTempDBEmpty]); // Re-run the effect if currentPage or fetchdata_chart_3 changes
  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.h1}>Forecast</h1>
        <div className={styles.buttonGroup}>
          <DatePicker />
        </div>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            buttons={["Temperature", "Humidity", "Brightness"]}
            doSomethingAfterClick={printButtonLabel}
            defaultActiveButton={0}
            activeButton={charttype}
          />
        </div>
        <div className={styles.diagramm}>
          {charttype === "Temperature" ? (
            <div>
              {isLoading_chart_1 ? (
                <div className={styles.chart_container}>
                  <div style={{ margin: "2%" }}>
                    {IsDataTempDBEmpty === true && IsDataTempForecastEmpty ? (
                      <div className={styles.banner}>
                        No Data for Temperature. If it is not expected, please
                        contact the support!
                      </div>
                    ) : (
                      <Line
                        data={{
                          labels: tempchardata.map((data) => data.time),
                          datasets: [
                            {
                              label: "Past Data",
                              data: tempchardata.map((data) => data.temp_c),
                              borderColor: ["rgba(0, 0, 237, 1)"],
                            },
                            {
                              label: "Forecast Data",
                              data: tempcharforecast.map((data) => data.temp_c),
                              borderColor: ["rgba(0, 237, 0, 1)"],
                            },
                          ],
                        }}
                        options={{
                          spanGaps: false,
                          animation: false,
                          pointRadius: 1,
                          spanGaps: false,
                          interaction: {
                            intersect: false,
                            mode: "index",
                          },
                          plugins: {
                            legend: {
                              display: true,
                              position: "bottom",
                              labels: {
                                boxWidth: 20,
                                padding: 20,
                              },
                              onClick: null,
                            },
                          },
                          tooltips: {
                            enabled: true, // enable tooltips
                            callbacks: {
                              // customize tooltip content
                              label: (context) => {
                                const datasetLabel =
                                  context.dataset.label || "";
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
                    )}
                  </div>
                  {IsDataTempDBEmpty === true ? (
                    <div className={styles.hint}>
                      No Temperature data for the past. If it is not expected,
                      please contact the support!
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {IsDataTempForecastEmpty === true ? (
                    <div className={styles.hint}>
                      No Temperature data for forecast. If it is not expected,
                      please contact the support!
                    </div>
                  ) : (
                    <div></div>
                  )}
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
          {charttype === "Humidity" ? (
            <div>
              {isLoading_chart_2 ? (
                <div className={styles.chart_container}>
                  <div style={{ margin: "2%" }}>
                    {IsDataTempDBEmpty === true ? (
                      <div className={styles.banner}>
                        No Data for Humidity. If it is not expected, please
                        contact the support!
                      </div>
                    ) : (
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
                                const datasetLabel =
                                  context.dataset.label || "";
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
                    )}
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
          {charttype === "Brightness" ? (
            <div>
              {isLoading_chart_3 ? (
                <div className={styles.chart_container}>
                  <div style={{ margin: "2%" }}>
                    {IsDataTempDBEmpty === true ? (
                      <div className={styles.banner}>
                        No Data for Brightness. If it is not expected, please
                        contact the support!
                      </div>
                    ) : (
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
                                const datasetLabel =
                                  context.dataset.label || "";
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
                    )}
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
