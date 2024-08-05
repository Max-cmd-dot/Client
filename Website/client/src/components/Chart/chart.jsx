///////////imports///////////
import styles from "./chart.css";
import { Line, Scatter } from "react-chartjs-2";
import "chartjs-adapter-moment";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
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
} from "chart.js";
Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip
);
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_API_URL;
const userId = Cookies.get("userId");
///////////MAIN FUNCTION///////////
const ChartComponent = ({ chartName }) => {
  //generelll
  const groupId = Cookies.get("groupId");
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeRoute("/history"));
  }, [dispatch]); // Re-run the effect if dispatch changes
  //to get the window size for the settingsgroup
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  //data arrays
  let [tempchardata, settempchardata] = useState([]);
  let [humchardata, sethumchardata] = useState([]);
  let [luxchardata, setluxchardata] = useState([]);
  let [moi1chardata, setmoi1chardata] = useState([]);
  let [moi2chardata, setmoi2chardata] = useState([]);
  let [moi3chardata, setmoi3chardata] = useState([]);

  //generell
  const [isLoadingChart, setisLoadingChart] = useState(true);

  //settings
  const [loadingTime, setloadingTime] = useState(false);
  const [chartTyp, setchartTyp] = useState("line");
  const [update_interval, setupdate_interval] = useState(15000);
  const [updateDataInterval, setUpdateDataInterval] = useState(15000);
  const [SettingsState, setSettingsState] = useState(true);
  const [max_count, setmax_count] = useState(100);

  //chart 1 datasets checks
  // prettier-ignore
  const [datasetTemperatureChecked, setDatasetTemperatureChecked] = useState(true);
  // prettier-ignore
  const [datasetHumidityChecked, setDatasetHumidityChecked] = useState(false);
  // prettier-ignore
  const [datasetMoistureOneChecked, setdatasetMoistureOneChecked] = useState(false);
  // prettier-ignore
  const [datasetMoistureTwoChecked, setdatasetMoistureTwoChecked] = useState(false);
  // prettier-ignore
  const [datasetMoistureThreeChecked, setdatasetMoistureThreeChecked] = useState(false);
  // prettier-ignore
  const [datasetLuxChecked, setDatasetLuxChecked] = useState(false);

  //stats of Popups
  const [IsEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [IsDataPopupOpen, setIsDataPopupOpen] = useState(false);
  const [IsCountPopupOpen, setIsCountPopupOpen] = useState(false);
  const [IsTypePopupOpen, setIsTypePopupOpen] = useState(false);
  const [IsIntervalPopupOpen, setIsIntervalPopupOpen] = useState(false);

  //fetch the data and initilize it from the server
  useEffect(() => {
    // Fetch data from the settings table in the database
    const fetchDataPreset = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/historyChart/settings/${userId}/${chartName}`
        );
        const data = await response.json();
        console.log(`Data: ${JSON.stringify(data)}`);
        // Set the state with the data from the response
        if (data) {
          setchartTyp(data.type);
          setupdate_interval(data.update_interval);
          setUpdateDataInterval(data.data_interval);
          setmax_count(data.max_count);
          setDatasetTemperatureChecked(data.datasets[0].checked_temperature);
          setDatasetHumidityChecked(data.datasets[0].checked_humidity);
          setdatasetMoistureOneChecked(data.datasets[0].checked_moisture_1);
          setdatasetMoistureTwoChecked(data.datasets[0].checked_moisture_2);
          setdatasetMoistureThreeChecked(data.datasets[0].checked_moisture_3);
          setDatasetLuxChecked(data.datasets[0].checked_lux);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDataPreset();
  }, []);

  const handleServerUpdate = async (endpoint, method, data) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/historyChart/${endpoint}/${userId}/${chartName}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateIntervalChange = async (event) => {
    const selectedInterval = parseInt(event.target.value);
    setupdate_interval(selectedInterval);
    handleServerUpdate("change_update_interval", "PUT", {
      update_interval: selectedInterval,
    });
  };

  const handleDataIntervalChange = async (event) => {
    const selectedDataInterval = parseInt(event.target.value);
    setUpdateDataInterval(selectedDataInterval);
    handleServerUpdate("change_data_interval", "PUT", {
      data_interval: selectedDataInterval,
    });
  };

  const handleMaxCountChange = async (event) => {
    const selectedMaxCount = parseInt(event.target.value);
    setmax_count(selectedMaxCount);
    handleServerUpdate("change_max_count", "PUT", {
      max_count: selectedMaxCount,
    });
  };

  const handleTypeChange = async (event) => {
    const selectedchartTyp = event.target.value;
    setchartTyp(selectedchartTyp);
    handleServerUpdate("change_type", "PUT", { type: selectedchartTyp });
  };
  const settings = () => {
    setSettingsState(!SettingsState);
  };

  ////////getting the data///////////
  useEffect(() => {
    if (currentPage === "/history") {
      let isMounted = true;
      const fetchChartData = async () => {
        try {
          setloadingTime(Date.now());

          const dataTypes = [
            {
              type: "temperature",
              checked: datasetTemperatureChecked,
              setData: settempchardata,
            },
            {
              type: "humidity",
              checked: datasetHumidityChecked,
              setData: sethumchardata,
            },
            {
              type: "moisture/1",
              checked: datasetMoistureOneChecked,
              setData: setmoi1chardata,
            },
            {
              type: "moisture/2",
              checked: datasetMoistureTwoChecked,
              setData: setmoi2chardata,
            },
            {
              type: "moisture/3",
              checked: datasetMoistureThreeChecked,
              setData: setmoi3chardata,
            },
            {
              type: "lux",
              checked: datasetLuxChecked,
              setData: setluxchardata,
            },
          ];

          for (let i = 0; i < dataTypes.length; i++) {
            const { type, checked, setData } = dataTypes[i];

            if (checked) {
              const response = await axios.get(
                `${apiUrl}/api/data/all/${type}?groupId=${groupId}&count=${max_count}`
              );
              const dataArr = [];
              for (let thing in response.data) {
                dataArr.push({
                  time: response.data[thing].time,
                  value: response.data[thing].value,
                });
              }
              if (isMounted) {
                setData(dataArr.reverse());
              }
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          if (isMounted) {
            const elapsedTime = Date.now() - loadingTime;
            if (elapsedTime > 100) {
              setisLoadingChart(true);
            }
          }
        }
      };

      fetchChartData();

      const interval = setInterval(fetchChartData, update_interval);

      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [
    currentPage,

    datasetTemperatureChecked,
    datasetHumidityChecked,
    datasetMoistureOneChecked,
    datasetMoistureTwoChecked,
    datasetMoistureThreeChecked,
    datasetLuxChecked,
    update_interval,
    updateDataInterval,
    max_count,
  ]);

  const handleChangeDataset = async (event, dataType, setChecked) => {
    setChecked(event.target.checked);
    const checked = event.target.checked;

    try {
      await fetch(
        `${apiUrl}/api/historyChart/change_datasets/${userId}/${chartName}/${dataType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ checked }),
        }
      );
    } catch (err) {
      console.error(`Error updating chart state: ${err}`);
    }
  };

  const Chart = () => {
    return (
      <div>
        <h2 className="heading">{chartName}</h2>
        <div className="graph">
          {isLoadingChart ? (
            <div>
              {chartTyp === "line" ? (
                <Line
                  data={{
                    labels: tempchardata.map(
                      (tempchardata) => tempchardata.time
                    ),
                    datasets: [
                      datasetTemperatureChecked && {
                        label: "Temperature",
                        data: tempchardata.map(
                          (tempchardata) => tempchardata.value
                        ),
                        borderColor: ["rgba(150, 0, 237, 1)"],
                        backgroundColor: "rgba(150, 0, 237, 1)", //changes the color of the middle of the circle of the legend
                      },
                      datasetHumidityChecked && {
                        label: "Humidity",
                        data: humchardata.map(
                          (humchardata) => humchardata.value
                        ),
                        borderColor: ["rgba(0, 100, 137, 1)"],
                        backgroundColor: "rgba(0, 100, 137, 1)",
                      },
                      datasetMoistureOneChecked && {
                        label: "Moisture 1",
                        data: moi1chardata.map(
                          (moi1chardata) => moi1chardata.value
                        ),
                        borderColor: ["rgba(100, 100, 137, 1)"],
                        backgroundColor: "rgba(100, 100, 137, 1)",
                      },
                      datasetMoistureTwoChecked && {
                        label: "Moisture 2",
                        data: moi2chardata.map(
                          (moi2chardata) => moi2chardata.value
                        ),
                        borderColor: ["rgba(100, 100, 137, 1)"],
                        backgroundColor: "rgba(100, 100, 137, 1)",
                      },
                      datasetMoistureThreeChecked && {
                        label: "Moisture 3",
                        data: moi3chardata.map(
                          (moi3chardata) => moi3chardata.value
                        ),
                        borderColor: ["rgba(100, 100, 137, 1)"],
                        backgroundColor: "rgba(100, 100, 137, 1)",
                      },
                      datasetLuxChecked && {
                        label: "Lux",
                        data: luxchardata.map(
                          (luxchardata) => luxchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                        backgroundColor: "rgba(0, 0, 237, 1)",
                      },
                    ].filter(Boolean),
                  }}
                  options={{
                    animation: false,
                    pointRadius: 0,
                    interaction: {
                      intersect: false,
                      mode: "index",
                    },
                    plugins: {
                      legend: {
                        display: true,
                        onClick: null,
                        labels: {
                          usePointStyle: true,
                        },
                      },
                    },

                    scales: {
                      x: {
                        type: "time",
                        time: {
                          displayFormats: {
                            hour: "HH:MM",
                          },
                        },
                        ticks: {
                          source: "auto",
                          maxRotation: 0,
                          autoSkip: true,
                          reverse: true,
                        },
                      },
                    },
                  }}
                  className="chart"
                />
              ) : chartTyp === "scatter" ? (
                <Scatter
                  data={{
                    labels: tempchardata.map(
                      (tempchardata) => tempchardata.time
                    ),
                    datasets: [
                      datasetTemperatureChecked && {
                        label: "Temperature",
                        data: tempchardata.map(
                          (tempchardata) => tempchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      datasetHumidityChecked && {
                        label: "Humidity",
                        data: humchardata.map(
                          (humchardata) => humchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      datasetMoistureOneChecked && {
                        label: "Moisture 1",
                        data: moi1chardata.map(
                          (moi1chardata) => moi1chardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                      datasetMoistureTwoChecked && {
                        label: "Moisture 2",
                        data: moi2chardata.map(
                          (moi2chardata) => moi2chardata.value
                        ),
                        borderColor: ["rgba(100, 100, 137, 1)"],
                        backgroundColor: "rgba(100, 100, 137, 1)",
                      },
                      datasetMoistureThreeChecked && {
                        label: "Moisture 3",
                        data: moi3chardata.map(
                          (moi3chardata) => moi3chardata.value
                        ),
                        borderColor: ["rgba(100, 100, 137, 1)"],
                        backgroundColor: "rgba(100, 100, 137, 1)",
                      },
                      datasetLuxChecked && {
                        label: "Lux",
                        data: luxchardata.map(
                          (luxchardata) => luxchardata.value
                        ),
                        borderColor: ["rgba(0, 0, 237, 1)"],
                      },
                    ].filter(Boolean),
                  }}
                  options={{
                    animation: false,
                    pointRadius: 5,
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
                            hour: "HH:MM",
                          },
                        },
                        ticks: {
                          source: "auto",
                          // Disabled rotation for performance
                          maxRotation: 0,
                          autoSkip: true,
                          reverse: true,
                        },
                      },
                    },
                  }}
                  className="chart"
                />
              ) : (
                <div>
                  <h1>Error please Contact the Support!</h1>
                </div>
              )}

              <div
                style={
                  windowWidth > 1100
                    ? { width: "fit-content" }
                    : { width: "100%" }
                }
              >
                <div
                  style={{
                    marginTop: "1%",
                    marginBottom: "1%",
                    transition: "width 200s",
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: SettingsState ? "#f1f1f1" : "transparent",
                    borderRadius: "50px",
                    boxShadow: SettingsState
                      ? "0px 0px 20px rgba(0, 0, 0, 0.25)"
                      : "none",
                    alignItems: "center",
                    marginLeft: "2%",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={settings}
                    className="edit_popup"
                    style={{
                      backgroundColor: SettingsState ? "#0088ff" : "#2c3e50",
                      color: "white",
                    }}
                  >
                    Settings
                  </button>
                  <div
                    style={{
                      visibility: SettingsState ? "visible" : "hidden",
                      overflow: "hidden",
                      transition: "width 10s",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => setIsEditPopupOpen(true)}
                      className="edit_popup"
                    >
                      edit dataset
                    </button>
                    <button
                      onClick={() => setIsTypePopupOpen(true)}
                      className="edit_popup"
                    >
                      chart type
                    </button>
                    <button
                      onClick={() => setIsCountPopupOpen(true)}
                      className="edit_popup"
                    >
                      max count
                    </button>
                    <button
                      onClick={() => setIsDataPopupOpen(true)}
                      className="edit_popup"
                    >
                      data interval
                    </button>
                    <button
                      onClick={() => setIsIntervalPopupOpen(true)}
                      className="edit_popup"
                    >
                      update interval
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="loading">
              <ClipLoader size={50} className="heading" />
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <div>
        <div>
          <div className="diagramm">
            <div className="chart_container">
              <div style={{ margin: "3%" }}>{Chart()}</div>
            </div>
          </div>

          {IsEditPopupOpen && (
            <div className="popup">
              <div className="popupContent">
                <h3>Choose your Datasets for this Chart</h3>
                <div className="checkbox">
                  <form>
                    <input
                      type="checkbox"
                      name="Temperature"
                      checked={datasetTemperatureChecked}
                      onChange={(event) =>
                        handleChangeDataset(
                          event,
                          "temperature",
                          setDatasetTemperatureChecked
                        )
                      }
                    />
                    <label htmlFor="Temperature">Temperature</label>

                    <input
                      type="checkbox"
                      name="Humidity"
                      checked={datasetHumidityChecked}
                      onChange={(event) =>
                        handleChangeDataset(
                          event,
                          "humidity",
                          setDatasetHumidityChecked
                        )
                      }
                    />
                    <label htmlFor="Humidity">Humidity</label>

                    <input
                      type="checkbox"
                      name="Moisture 1"
                      checked={datasetMoistureOneChecked}
                      onChange={(event) =>
                        handleChangeDataset(
                          event,
                          "moisture",
                          setdatasetMoistureOneChecked
                        )
                      }
                    />
                    <label htmlFor="Moisture 1">Moisture 1</label>
                    <input
                      type="checkbox"
                      name="Moisture 2"
                      checked={datasetMoistureTwoChecked}
                      onChange={(event) =>
                        handleChangeDataset(
                          event,
                          "moisture",
                          setdatasetMoistureTwoChecked
                        )
                      }
                    />
                    <label htmlFor="Moisture 2">Moisture 2</label>
                    <input
                      type="checkbox"
                      name="Moisture 3"
                      checked={datasetMoistureThreeChecked}
                      onChange={(event) =>
                        handleChangeDataset(
                          event,
                          "moisture",
                          setdatasetMoistureThreeChecked
                        )
                      }
                    />
                    <label htmlFor="Moisture 3">Moisture 3</label>

                    <input
                      type="checkbox"
                      name="lux"
                      checked={datasetLuxChecked}
                      onChange={(event) =>
                        handleChangeDataset(event, "lux", setDatasetLuxChecked)
                      }
                    />
                    <label htmlFor="Lux">lux</label>

                    <br></br>
                  </form>
                </div>
                <button
                  onClick={() => setIsEditPopupOpen(false)}
                  className="edit_popup"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {IsDataPopupOpen && (
            <div className="popup">
              <div className="popupContent">
                <h3>Select your data Interval</h3>
                <label htmlFor="updateInterval">Data Interval: </label>
                <select
                  id="updateInterval"
                  value={updateDataInterval}
                  onChange={handleDataIntervalChange}
                >
                  <option value={100}>Live</option>
                  <option value={60000}>1 minutes</option>
                  <option value={600000}>10 minutes</option>
                  <option value={900000}>15 minutes</option>
                  <option value={1800000}>30 minutes</option>
                  <option value={2700000}>45 minutes</option>
                  <option value={3600000}>1 hour</option>
                </select>
                <div className="checkbox"></div>
                <button
                  onClick={() => setIsDataPopupOpen(false)}
                  className="edit_popup"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsCountPopupOpen && (
            <div className="popup">
              <div className="popupContent">
                <h3>Select your max count of data points</h3>
                <label htmlFor="max_count">Data Interval: </label>
                <select
                  id="max count"
                  value={max_count}
                  onChange={handleMaxCountChange}
                >
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={2000}>2000</option>
                  <option value={3000}>3000</option>
                  <option value={4000}>4000</option>
                </select>
                <div className="checkbox"></div>
                <button
                  onClick={() => setIsCountPopupOpen(false)}
                  className="edit_popup"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsTypePopupOpen && (
            <div className="popup">
              <div className="popupContent">
                <h3>Select your type of chart</h3>
                <label htmlFor="chart_type">Type </label>
                <select
                  value={chartTyp}
                  id="Chart Type"
                  onChange={handleTypeChange}
                >
                  <option>line</option>
                  <option>scatter</option>
                </select>
                <div className="checkbox"></div>
                <button
                  onClick={() => setIsTypePopupOpen(false)}
                  className="edit_popup"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {IsIntervalPopupOpen && (
            <div className="popup">
              <div className="popupContent">
                <h3>Select the interval the Chart should update</h3>
                <label htmlFor="updateInterval_">Update Interval: </label>
                <select
                  id="updateInterval"
                  value={update_interval}
                  onChange={handleUpdateIntervalChange}
                >
                  <option value={100}>Live</option>
                  <option value={5000}>5 seconds</option>
                  <option value={10000}>10 seconds</option>
                  <option value={15000}>15 seconds</option>
                </select>
                <div className="checkbox"></div>
                <button
                  onClick={() => setIsIntervalPopupOpen(false)}
                  className="edit_popup"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChartComponent;
