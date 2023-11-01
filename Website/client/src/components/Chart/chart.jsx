///////////imports///////////
import styles from "./chart.css";
import { Line, Scatter, Tooltip } from "react-chartjs-2";
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
} from "chart.js";
Chart.register(
  ArcElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale
);
import { useSelector, useDispatch } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;

///////////MAIN FUNCTION///////////
const ChartComponent = ({ chartName }) => {
  //generelll
  const groupId = localStorage.getItem("groupId");
  const [count_chart_1, setcount_chart_1] = useState(100);
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeRoute("/history"));
  }, [dispatch]); // Re-run the effect if dispatch changes
  let [tempchardata, settempchardata] = useState([]);
  let [humchardata, sethumchardata] = useState([]);
  let [luxchardata, setluxchardata] = useState([]);
  let [moi1chardata, setmoi1chardata] = useState([]);
  let [moi2chardata, setmoi2chardata] = useState([]);
  let [moi3chardata, setmoi3chardata] = useState([]);
  //first chart
  const [isLoading_chart_1, setIsLoading_chart_1] = useState(false);
  //secound chart
  const [loadingTime_1, setLoadingTime_1] = useState(false);
  const [chart1Checked, setChart1Checked] = useState(true);
  const [type_chart_1, settype_chart_1] = useState(1);
  const [update_interval_value_chart_1, setupdate_interval_value_chart_1] =
    useState(15000);
  const [
    update_data_interval_value_chart_1,
    setupdate_data_interval_value_chart_1,
  ] = useState(15000);
  const [settings_state_chart_1, setsettings_state_chart_1] = useState(true);
  //chart 1 datasets checks
  const [
    dataset_temperature_Chart1Checked,
    setDataset_temperature_Chart1Checked,
  ] = useState(true);
  const [dataset_humidity_Chart1Checked, setDataset_humidity_Chart1Checked] =
    useState(false);
  const [dataset_moisture_Chart1Checked, setdataset_moisture_Chart1Checked] =
    useState(false);
  const [dataset_lux_Chart1Checked, setdataset_lux_Chart1Checked] =
    useState(false);
  const [IsEditPopupOpen_1, setIsEditPopupOpen_1] = useState(false);
  const [IsDataPopupOpen_1, setIsDataPopupOpen_1] = useState(false);
  const [IsCountPopupOpen_1, setIsCountPopupOpen_1] = useState(false);
  const [IsTypePopupOpen_1, setIsTypePopupOpen_1] = useState(false);
  const [IsIntervalPopupOpen_1, setIsIntervalPopupOpen_1] = useState(false);

  //general settings

  const openEditPopup_1 = () => {
    setIsEditPopupOpen_1(true);
  };

  const closeEditPopup_1 = () => {
    setIsEditPopupOpen_1(false);
  };
  const openIntervalPopup_1 = () => {
    setIsIntervalPopupOpen_1(true);
  };

  const closeIntervalPopup_1 = () => {
    setIsIntervalPopupOpen_1(false);
  };
  const openDataPopup_1 = () => {
    setIsDataPopupOpen_1(true);
  };

  const closeDataPopup_1 = () => {
    setIsDataPopupOpen_1(false);
  };
  const openCountPopup_1 = () => {
    setIsCountPopupOpen_1(true);
  };

  const closeCountPopup_1 = () => {
    setIsCountPopupOpen_1(false);
  };
  const openTypePopup_1 = () => {
    setIsTypePopupOpen_1(true);
  };

  const closeTypePopup_1 = () => {
    setIsTypePopupOpen_1(false);
  };

  const live_data_1 = () => {
    console.log("live data_1");
  };
  const handleIntervalChange_chart_1 = (event) => {
    //gets value of drop down
    const selectedInterval_chart_1 = parseInt(event.target.value);
    //updates the value of the interval
    setupdate_interval_value_chart_1(selectedInterval_chart_1);
  };
  const handleDataIntervalChange_chart_1 = (event) => {
    //gets value of drop down
    const selectedDataInterval_chart_1 = parseInt(event.target.value);
    //updates the value of the interval
    setupdate_data_interval_value_chart_1(selectedDataInterval_chart_1);
  };
  const handleCountChange_chart_1 = (event) => {
    //gets value of drop down
    const selectedCount_chart_1 = parseInt(event.target.value);
    //updates the value of the interval
    setcount_chart_1(selectedCount_chart_1);
  };
  const handleTypeChange_chart_1 = (event) => {
    //gets value of drop down
    const selectedType_chart_1 = parseInt(event.target.value);
    //updates the value of the interval
    settype_chart_1(selectedType_chart_1);
  };
  const settings_chart_1 = () => {
    setsettings_state_chart_1(!settings_state_chart_1);
  };
  ////////getting the data///////////
  useEffect(() => {
    if (currentPage === "/history") {
      let isMounted = true;
      const fetchdata_chart_1 = async () => {
        try {
          setLoadingTime_1(Date.now());

          const checkboxPromise_Lux = [];
          const checkboxPromise_Humidity = [];
          const checkboxPromise_Temperature = [];
          const checkboxPromise_Moisture = [];

          if (dataset_temperature_Chart1Checked) {
            checkboxPromise_Temperature.push(
              axios.get(
                `${apiUrl}/api/data/all/temperature?groupId=${groupId}&count=${count_chart_1}`
              )
            );
          }
          if (dataset_humidity_Chart1Checked) {
            checkboxPromise_Humidity.push(
              axios.get(`${apiUrl}/api/data/all/humidity?groupId=${groupId}`)
            );
          }
          if (dataset_moisture_Chart1Checked) {
            checkboxPromise_Moisture.push(
              axios.get(`${apiUrl}/api/data/all/moisture/1?groupId=${groupId}`)
            );
            checkboxPromise_Moisture.push(
              axios.get(`${apiUrl}/api/data/all/moisture/2?groupId=${groupId}`)
            );
            checkboxPromise_Moisture.push(
              axios.get(`${apiUrl}/api/data/all/moisture/3?groupId=${groupId}`)
            );
          }
          if (dataset_lux_Chart1Checked) {
            checkboxPromise_Lux.push(
              axios.get(`${apiUrl}/api/data/all/lux?groupId=${groupId}`)
            );
          }
          const response_Moisture = await Promise.all(checkboxPromise_Moisture);
          const response_Humdidity = await Promise.all(
            checkboxPromise_Humidity
          );
          const response_Temperature = await Promise.all(
            checkboxPromise_Temperature
          );
          const response_Lux = await Promise.all(checkboxPromise_Lux);

          if (chart1Checked) {
            if (dataset_temperature_Chart1Checked) {
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
            }
            //humidity data
            if (dataset_humidity_Chart1Checked) {
              const humidityDataArr = [];
              let counterhumidity = 0;
              for (let thing in response_Humdidity[0].data) {
                if (counterhumidity < 100) {
                  humidityDataArr.push({
                    time: response_Humdidity[0].data[thing].time,
                    value: response_Humdidity[0].data[thing].value,
                  });
                  counterhumidity++;
                }
              }
              const reversedhumidityDataArr = humidityDataArr.reverse();

              if (isMounted) {
                sethumchardata(reversedhumidityDataArr);
              }
            }
            //moisture data
            if (dataset_moisture_Chart1Checked) {
              const moisture1DataArr = [];
              let countermoisture1 = 0;
              for (let thing in response_Moisture[0].data) {
                if (countermoisture1 < 100) {
                  moisture1DataArr.push({
                    time: response_Moisture[0].data[thing].time,
                    value: response_Moisture[0].data[thing].value,
                  });
                  countermoisture1++;
                }
              }
              const reversedmoisture1DataArr = moisture1DataArr.reverse();

              const moisture2DataArr = [];
              let countermoisture2 = 0;
              for (let thing in response_Moisture[0].data) {
                if (countermoisture2 < 100) {
                  moisture2DataArr.push({
                    time: response_Moisture[0].data[thing].time,
                    value: response_Moisture[0].data[thing].value,
                  });
                  countermoisture2++;
                }
              }
              const reversedmoisture2DataArr = moisture2DataArr.reverse();

              const moisture3DataArr = [];
              let countermoisture3 = 0;
              for (let thing in response_Moisture[0].data) {
                if (countermoisture3 < 100) {
                  moisture3DataArr.push({
                    time: response_Moisture[0].data[thing].time,
                    value: response_Moisture[0].data[thing].value,
                  });
                  countermoisture3++;
                }
              }
              const reversedmoisture3DataArr = moisture3DataArr.reverse();

              if (isMounted) {
                setmoi1chardata(reversedmoisture1DataArr);
                setmoi2chardata(reversedmoisture2DataArr);
                setmoi3chardata(reversedmoisture3DataArr);
              }
            }
            if (dataset_lux_Chart1Checked) {
              const luxDataArr = [];
              let counterlux = 0;
              for (let thing in response_Lux[0].data) {
                if (counterlux < 100) {
                  luxDataArr.push({
                    time: response_Lux[0].data[thing].time,
                    value: response_Lux[0].data[thing].value,
                  });
                  counterlux++;
                }
              }
              const reversedluxDataArr = luxDataArr.reverse();

              if (isMounted) {
                setluxchardata(reversedluxDataArr);
              }
            }
          }
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

      if (chart1Checked) {
        fetchdata_chart_1();
      }
      const interval_chart_1 = setInterval(
        fetchdata_chart_1,
        update_interval_value_chart_1
      );

      return () => {
        isMounted = false;
        clearInterval(interval_chart_1);
      };
    }
  }, [
    currentPage,
    chart1Checked,

    dataset_temperature_Chart1Checked,
    dataset_humidity_Chart1Checked,
    dataset_moisture_Chart1Checked,
    dataset_lux_Chart1Checked,

    update_interval_value_chart_1,
    update_data_interval_value_chart_1,
    count_chart_1,
  ]);

  //chart 1
  const handleChange_dataset_temperature_Chart1 = (event) => {
    setDataset_temperature_Chart1Checked(event.target.checked);
  };
  const handleChange_dataset_humidity_Chart1 = (event) => {
    setDataset_humidity_Chart1Checked(event.target.checked);
  };
  const handleChange_dataset_moisture_Chart1 = (event) => {
    setdataset_moisture_Chart1Checked(event.target.checked);
  };
  const handleChange_dataset_lux_Chart1 = (event) => {
    setdataset_lux_Chart1Checked(event.target.checked);
  };

  const Chart_1 = () => {
    if (chart1Checked === true) {
      return (
        <div>
          <h2 className="heading">{chartName}</h2>
          <div className="graph">
            {isLoading_chart_1 ? (
              <div>
                {type_chart_1 === 1 ? (
                  <Line
                    data={{
                      labels: tempchardata.map(
                        (tempchardata) => tempchardata.time
                      ),
                      datasets: [
                        dataset_temperature_Chart1Checked && {
                          label: "tempchardata",
                          data: tempchardata.map(
                            (tempchardata) => tempchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_humidity_Chart1Checked && {
                          label: "humchardata",
                          data: humchardata.map(
                            (humchardata) => humchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_moisture_Chart1Checked && {
                          label: "moisturedata",
                          data: moi1chardata.map(
                            (moi1chardata) => moi1chardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_lux_Chart1Checked && {
                          label: "luxchardata",
                          data: luxchardata.map(
                            (luxchardata) => luxchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
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
                ) : type_chart_1 === 2 ? (
                  <Scatter
                    data={{
                      labels: tempchardata.map(
                        (tempchardata) => tempchardata.time
                      ),
                      datasets: [
                        dataset_temperature_Chart1Checked && {
                          label: "tempchardata",
                          data: tempchardata.map(
                            (tempchardata) => tempchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_humidity_Chart1Checked && {
                          label: "humchardata",
                          data: humchardata.map(
                            (humchardata) => humchardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_moisture_Chart1Checked && {
                          label: "moisturedata",
                          data: moi1chardata.map(
                            (moi1chardata) => moi1chardata.value
                          ),
                          borderColor: ["rgba(0, 0, 237, 1)"],
                        },
                        dataset_lux_Chart1Checked && {
                          label: "luxchardata",
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
                    <h1>error</h1>
                  </div>
                )}

                <div
                  style={{
                    transition: "width 200s",
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: settings_state_chart_1
                      ? "#f1f1f1"
                      : "transparent",
                    borderRadius: "50px",
                    boxShadow: settings_state_chart_1
                      ? "0px 0px 20px rgba(0, 0, 0, 0.25)"
                      : "none",
                    alignItems: "center",
                    width: "fit-content",
                    marginLeft: "2%",
                  }}
                >
                  <button
                    onClick={settings_chart_1}
                    className="edit_popup"
                    style={{
                      backgroundColor: settings_state_chart_1
                        ? "#2c3e50"
                        : "#0088ff",
                      color: "white",
                    }}
                  >
                    Settings
                  </button>
                  <div
                    style={{
                      visibility: settings_state_chart_1 ? "visible" : "hidden",
                      overflow: "hidden",
                      transition: "width 10s",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <button onClick={openEditPopup_1} className="edit_popup">
                      Edit Dataset
                    </button>
                    <button onClick={openTypePopup_1} className="edit_popup">
                      change type
                    </button>
                    <button onClick={openCountPopup_1} className="edit_popup">
                      max count
                    </button>
                    <button onClick={openDataPopup_1} className="edit_popup">
                      data interval
                    </button>
                    <button onClick={live_data_1} className="edit_popup">
                      .live data.
                    </button>
                    <button
                      onClick={openIntervalPopup_1}
                      className="edit_popup"
                    >
                      update interval
                    </button>
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
    } else {
      return null;
    }
  };
  return (
    <>
      <div>
        <div>
          <div className="diagramm">
            <div className="chart_container">
              <div style={{ margin: "3%" }}>{Chart_1()}</div>
            </div>
          </div>

          {IsEditPopupOpen_1 && (
            <div className="popup">
              <div className="popupContent">
                <h3>Choose your Datasets for this Chart</h3>
                <div className="checkbox">
                  <form>
                    <input
                      type="checkbox"
                      name="Temperature"
                      checked={dataset_temperature_Chart1Checked}
                      onChange={handleChange_dataset_temperature_Chart1}
                    />
                    <label htmlFor="Temperature">Temperature</label>

                    <input
                      type="checkbox"
                      name="Humidity"
                      checked={dataset_humidity_Chart1Checked}
                      onChange={handleChange_dataset_humidity_Chart1}
                    />
                    <label htmlFor="Humidity">Humidity</label>

                    <input
                      type="checkbox"
                      name="Moisture"
                      checked={dataset_moisture_Chart1Checked}
                      onChange={handleChange_dataset_moisture_Chart1}
                    />
                    <label htmlFor="Moisture">Moisture</label>

                    <input
                      type="checkbox"
                      name="lux"
                      checked={dataset_lux_Chart1Checked}
                      onChange={handleChange_dataset_lux_Chart1}
                    />
                    <label htmlFor="Lux_1">lux</label>

                    <br></br>
                  </form>
                </div>
                <button onClick={closeEditPopup_1} className="edit_popup">
                  Close
                </button>
              </div>
            </div>
          )}

          {IsDataPopupOpen_1 && (
            <div className="popup">
              <div className="popupContent">
                <h3>Select your data Interval</h3>
                <label htmlFor="updateInterval_chart_1">Data Interval: </label>
                <select
                  id="updateInterval_chart_1"
                  value={update_interval_value_chart_1}
                  onChange={handleDataIntervalChange_chart_1}
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
                <button onClick={closeDataPopup_1} className="edit_popup">
                  Close
                </button>
              </div>
            </div>
          )}
          {IsCountPopupOpen_1 && (
            <div className="popup">
              <div className="popupContent">
                <h3>Select your max count of data points</h3>
                <label htmlFor="updateInterval_chart_1">Data Interval: </label>
                <select
                  id="updateInterval_chart_1"
                  value={count_chart_1}
                  onChange={handleCountChange_chart_1}
                >
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={2000}>2000</option>
                  <option value={3000}>3000</option>
                  <option value={4000}>4000</option>
                </select>
                <div className="checkbox"></div>
                <button onClick={closeCountPopup_1} className="edit_popup">
                  Close
                </button>
              </div>
            </div>
          )}
          {IsTypePopupOpen_1 && (
            <div className="popup">
              <div className="popupContent">
                <h3>Select yourtype of chart</h3>
                <label htmlFor="updateInterval_chart_1">Type </label>
                <select
                  id="updateInterval_chart_1"
                  value={count_chart_1}
                  onChange={handleTypeChange_chart_1}
                >
                  <option value={1}>line</option>
                  <option value={2}>scatter</option>
                </select>
                <div className="checkbox"></div>
                <button onClick={closeTypePopup_1} className="edit_popup">
                  Close
                </button>
              </div>
            </div>
          )}
          {IsIntervalPopupOpen_1 && (
            <div className="popup">
              <div className="popupContent">
                <h3>Choose your Datasets for Chart 4</h3>
                <label htmlFor="updateInterval_chart_1">
                  Update Interval:{" "}
                </label>
                <select
                  id="updateInterval_chart_1"
                  value={update_interval_value_chart_1}
                  onChange={handleIntervalChange_chart_1}
                >
                  <option value={100}>Live</option>
                  <option value={5000}>5 seconds</option>
                  <option value={10000}>10 seconds</option>
                  <option value={15000}>15 seconds</option>
                </select>
                <div className="checkbox"></div>
                <button onClick={closeIntervalPopup_1} className="edit_popup">
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
