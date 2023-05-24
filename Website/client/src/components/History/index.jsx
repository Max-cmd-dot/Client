import styles from "./styles.module.css";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
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
const History = () => {
  const groupId = localStorage.getItem("groupId");
  let [tempchardata, settempchardata] = useState([]);
  let [humchardata, sethumchardata] = useState([]);
  let [luxchardata, setluxchardata] = useState([]);
  let [moi1chardata, setmoi1chardata] = useState([]);
  let [moi2chardata, setmoi2chardata] = useState([]);
  let [moi3chardata, setmoi3chardata] = useState([]);
  const [isLoadingTemperature, setIsLoadingTemperature] = useState(true);
  const [isLoadingMoisture, setIsLoadingMoisture] = useState(true);
  const [isLoadingLux, setIsLoadingLux] = useState(true);
  const [isLoadingHumidity, setIsLoadingHumidity] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedTemperature, setcheckedTemperature] = React.useState(false);
  const [checkedHumidity, setcheckedHumidity] = React.useState(false);
  const [checkedMoisture, setcheckedMoisture] = React.useState(false);
  const [checkedLux, setcheckedLux] = React.useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const checkboxPromises = [];

        if (checkedHumidity) {
          checkboxPromises.push(
            axios.get(
              `https://20.219.193.229:8080/api/data/all/humidity?groupId=${groupId}`
            )
          );
        }

        if (checkedLux) {
          checkboxPromises.push(
            axios.get(
              `https://20.219.193.229:8080/api/data/all/lux?groupId=${groupId}`
            )
          );
        }

        if (checkedTemperature) {
          checkboxPromises.push(
            axios.get(
              `https://20.219.193.229:8080/api/data/all/temperature?groupId=${groupId}`
            )
          );
        }

        if (checkedMoisture) {
          checkboxPromises.push(
            axios.get(
              `https://20.219.193.229:8080/api/data/all/moisture/1?groupId=${groupId}`
            )
          );
          checkboxPromises.push(
            axios.get(
              `https://20.219.193.229:8080/api/data/all/moisture/2?groupId=${groupId}`
            )
          );
          checkboxPromises.push(
            axios.get(
              `https://20.219.193.229:8080/api/data/all/moisture/3?groupId=${groupId}`
            )
          );
        }

        const responses = await Promise.all(checkboxPromises);

        // Process the responses and update the respective chart data states

        if (checkedHumidity) {
          const humidityDataArr = [];
          let counterhumidity = 0;
          for (let thing in responses[0].data) {
            if (counterhumidity < 1000) {
              humidityDataArr.push({
                time: responses[0].data[thing].time,
                value: responses[0].data[thing].value,
              });
              counterhumidity++;
            }
          }
          const reversedhumidityDataArr = humidityDataArr.reverse();

          if (isMounted) {
            sethumchardata(reversedhumidityDataArr);
          }
        }

        if (checkedLux) {
          const luxDataArr = [];
          let counterlux = 0;
          for (let thing in responses[1].data) {
            if (counterlux < 1000) {
              luxDataArr.push({
                time: responses[0].data[thing].time,
                value: responses[0].data[thing].value,
              });
              counterlux++;
            }
          }
          const reversedluxDataArr = luxDataArr.reverse();

          if (isMounted) {
            setluxchardata(reversedluxDataArr);
          }
        }

        if (checkedTemperature) {
          const temperatureDataArr = [];
          let countertemperature = 0;
          for (let thing in responses[0].data) {
            if (countertemperature < 1000) {
              temperatureDataArr.push({
                time: responses[0].data[thing].time,
                value: responses[0].data[thing].value,
              });
              countertemperature++;
            }
          }
          const reversedtemperatureDataArr = temperatureDataArr.reverse();

          if (isMounted) {
            settempchardata(reversedtemperatureDataArr);
          }
        }

        if (checkedMoisture) {
          const moisture1DataArr = [];
          let countermoisture1 = 0;
          for (let thing in responses[3].data) {
            if (countermoisture1 < 1000) {
              moisture1DataArr.push({
                time: responses[0].data[thing].time,
                value: responses[0].data[thing].value,
              });
              countermoisture1++;
            }
          }
          const reversedmoisture1DataArr = moisture1DataArr.reverse();

          const moisture2DataArr = [];
          let countermoisture2 = 0;
          for (let thing in responses[0].data) {
            if (countermoisture2 < 1000) {
              moisture2DataArr.push({
                time: responses[0].data[thing].time,
                value: responses[0].data[thing].value,
              });
              countermoisture2++;
            }
          }
          const reversedmoisture2DataArr = moisture2DataArr.reverse();

          const moisture3DataArr = [];
          let countermoisture3 = 0;
          for (let thing in responses[0].data) {
            if (countermoisture3 < 1000) {
              moisture3DataArr.push({
                time: responses[0].data[thing].time,
                value: responses[0].data[thing].value,
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

        // Similar processing for other responses based on checkbox selection
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 150000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [checkedHumidity, checkedLux, checkedTemperature, checkedMoisture]);

  const handleChangeTemperature = () => {
    setcheckedTemperature(!checkedTemperature);
    console.log(!checkedTemperature);
  };
  const handleChangeMoisture = () => {
    setcheckedMoisture(!checkedMoisture);
    console.log(!checkedMoisture);
  };
  const handleChangeHumidity = () => {
    setcheckedHumidity(!checkedHumidity);
    console.log(!checkedHumidity);
  };
  const handleChangeLux = () => {
    setcheckedLux(!checkedLux);
    console.log(!checkedLux);
  };
  const renderHumidity = () => {
    if (checkedHumidity === true) {
      return (
        <div>
          <h2 className={styles.heading}>Humdity Diagramm</h2>
          <div className={styles.graph}>
            {!isLoading ? (
              <Line
                data={{
                  labels: humchardata.map((humchardata) => humchardata.time),
                  datasets: [
                    {
                      label: "Dataset 1",
                      data: humchardata.map((humchardata) => humchardata.value),
                      borderColor: ["rgba(0, 250, 0, 1)"],
                    },
                  ],
                }}
                options={{
                  animation: false,
                  pointRadius: 0,
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
              />
            ) : (
              <div className={styles.loading}>
                <ClipLoader size={150} className={styles.heading} />
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const renderTemperature = () => {
    if (checkedTemperature === true) {
      return (
        <div>
          <h2 className={styles.heading}>Temperatur Diagramm</h2>
          <div className={styles.graph}>
            {!isLoading ? (
              <Line
                data={{
                  labels: tempchardata.map((tempchardata) => tempchardata.time),
                  datasets: [
                    {
                      label: "Dataset 1",
                      data: tempchardata.map(
                        (tempchardata) => tempchardata.value
                      ),
                      borderColor: ["rgba(237, 0, 0, 1)"],
                    },
                  ],
                }}
                options={{
                  animation: false,
                  pointRadius: 0,
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
              />
            ) : (
              <div className={styles.loading}>
                <ClipLoader size={150} className={styles.heading} />
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const renderMoisture = () => {
    if (checkedMoisture === true) {
      return (
        <div>
          <h2 className={styles.heading}>Moisture Diagramm</h2>
          <div className={styles.graph}>
            {!isLoading ? (
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
                options={{
                  animation: false,
                  pointRadius: 0,
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
              />
            ) : (
              <div className={styles.loading}>
                <ClipLoader size={150} className={styles.heading} />
              </div>
            )}
          </div>
        </div>
      );
    }
  };
  const renderLux = () => {
    if (checkedLux === true) {
      return (
        <div>
          <h2 className={styles.heading}>Brightness Diagramm (Lux)</h2>
          <div className={styles.graph}>
            {!isLoading ? (
              <Line
                data={{
                  labels: luxchardata.map((luxchardata) => luxchardata.time),
                  datasets: [
                    {
                      label: "Dataset 1",
                      data: luxchardata.map((luxchardata) => luxchardata.value),
                      borderColor: ["rgba(0, 250, 200, 1)"],
                    },
                  ],
                }}
                options={{
                  animation: false,
                  pointRadius: 0,
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
              />
            ) : (
              <div className={styles.loading}>
                <ClipLoader size={150} className={styles.heading} />
              </div>
            )}
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div>
        <h1 className={styles.heading}>History</h1>
        <div>
          <div className={styles.checkbox}>
            <form>
              <input
                type="checkbox"
                name={"Humidity"}
                onChange={handleChangeHumidity}
              />
              <label for="Humidity"> Humidity</label>
              <input
                type="checkbox"
                name={"Temperature"}
                onChange={handleChangeTemperature}
              />
              <label for="Temperature"> Temperature</label>
              <input
                type="checkbox"
                name={"Moisture"}
                onChange={handleChangeMoisture}
              />
              <label for="Moisture"> Moisture</label>
              <input type="checkbox" name={"Lux"} onChange={handleChangeLux} />
              <label for="Lux"> Lux</label>
              <br></br>
            </form>
          </div>
          <div className={styles.diagramm}>
            {renderTemperature()}
            {renderHumidity()}
            {renderMoisture()}
            {renderLux()}
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
