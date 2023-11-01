import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;
import ButtonGroup from "../ButtonGroup/button-group";

const Actions = () => {
  const groupId = localStorage.getItem("groupId");
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  const [buttongroupstate, setbuttongroupstate] = useState(0);
  let [list2, setList2] = useState([]);
  useEffect(() => {
    dispatch(changeRoute("/actions"));
  }, [dispatch]);

  const handleButtonWater = () => {
    setbuttongroupstate(0);
    console.log("Water");
  };
  const handleAir = () => {
    setbuttongroupstate(1);
    console.log("Air");
  };
  const handleSunshine = () => {
    setbuttongroupstate(2);
    console.log("Sunshine");
  };

  const printButtonLabel = (event) => {
    if (event.target.name === "Water") {
      handleButtonWater();
    }
    if (event.target.name === "Air") {
      handleAir();
    }
    if (event.target.name === "Sunshine") {
      handleSunshine();
    }
  };
  const start_1 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(`${apiUrl}/api/actions/?group=${groupId}&object=pump_1&value=on`);
    fetchData_current_state();
  };
  const start_2 = () => {
    //post request to url with data = "pump 2 on"
    axios.get(`${apiUrl}/api/actions/?group=${groupId}&object=pump_2&value=on`);
    fetchData_current_state();
  };
  const start_3 = () => {
    //post request to url with data = "pump 3 on"
    axios.get(`${apiUrl}/api/actions/?group=${groupId}&object=pump_3&value=on`);
    fetchData_current_state();
  };
  const start_4 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=ventilator_1&value=on`
    );
    fetchData_current_state();
  };
  const start_5 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=humidifyer_1&value=on`
    );
    fetchData_current_state();
  };
  const start_6 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(`${apiUrl}/api/actions/?group=${groupId}&object=roof_1&value=on`);
    fetchData_current_state();
  };
  const stop_1 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=pump_1&value=off`
    );
    fetchData_current_state();
  };
  const stop_2 = () => {
    //post request to url with data = "pump 2 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=pump_2&value=off`
    );
    fetchData_current_state();
  };
  const stop_3 = () => {
    //post request to url with data = "pump 3 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=pump_3&value=off`
    );
    fetchData_current_state();
  };
  const stop_4 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=ventilator_1&value=off`
    );
    fetchData_current_state();
  };
  const stop_5 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=humidifyer_1&value=off`
    );
    fetchData_current_state();
  };
  const stop_6 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=roof_1&value=off`
    );
    fetchData_current_state();
  };
  const fetchData_current_state = async () => {
    setTimeout(async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/actions/current_state?group=${groupId}`
        );
        const valuesArr = response.data.message.map((item) => ({
          object: item.object,
          group: item.group,
          value: item.value,
        }));
        setList2(valuesArr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      fetchData_current_state();
    }, 500);
  };
  useEffect(() => {
    if (currentPage === "/actions") {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/actions/current_state?group=${groupId}`
          );
          const valuesArr = response.data.message.map((item) => ({
            object: item.object,
            group: item.group,
            value: item.value,
          }));
          setList2(valuesArr);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentPage, groupId]);
  const objectOrder = [
    "pump_1",
    "pump_2",
    "pump_3",
    "ventilator_1",
    "humidifyer_1",
    "roof_1",
  ];
  const sortedList = list2.sort(
    (a, b) => objectOrder.indexOf(a.object) - objectOrder.indexOf(b.object)
  );

  return (
    <div className={styles.main_container}>
      <h1 className={styles.h1}>Actions</h1>
      <div className={styles.current_state}>
        <div className={styles.data}>
          {sortedList.map((item) => {
            let objectName = "";
            let sensorHeading = "";
            if (item.object === "pump_1") {
              objectName = "Pump 1";
              sensorHeading = "Status";
            } else if (item.object === "pump_2") {
              objectName = "Pump 2";
              sensorHeading = "Status";
            } else if (item.object === "pump_3") {
              objectName = "Pump 3";
              sensorHeading = "Status";
            } else if (item.object === "ventilator_1") {
              objectName = "Ventilator 1";
              sensorHeading = "Speed";
            } else if (item.object === "humidifyer_1") {
              objectName = "Humidifyer 1";
              sensorHeading = "Humidity";
            } else if (item.object === "roof_1") {
              objectName = "Roof 1";
              sensorHeading = "Position";
            }
            let sensor = {
              heading: sensorHeading,
              value: item.value,
            };
            return (
              <div className={styles.sensordata} key={item.object}>
                <div className={styles.elementssensordata}>
                  <h2 className={styles.sensorheading}>{sensor.heading}</h2>
                  <p
                    className={`${styles.sensorvalue} ${
                      sensor.value === "on" ? styles.on : styles.off
                    }`}
                  >
                    {sensor.value}
                  </p>
                </div>
                <p className={styles.objectname}>{objectName}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.box_gray}>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            buttons={["Water", "Air", "Sunshine"]}
            doSomethingAfterClick={printButtonLabel}
            defaultActiveButton={0}
            activeButton={buttongroupstate}
            overrideBoxColor={true}
            overrideButtonColor={false}
          />
        </div>
        <div>
          {buttongroupstate === 0 && (
            <div>
              <div className={styles.box}>
                <h1>
                  Pumpe 1
                  <button className={styles.button} onClick={start_1}>
                    Start
                  </button>
                  <button className={styles.button} onClick={stop_1}>
                    Stop
                  </button>
                </h1>
              </div>
              <div className={styles.box}>
                <h1>
                  Pumpe 2
                  <button className={styles.button} onClick={start_2}>
                    Start
                  </button>
                  <button className={styles.button} onClick={stop_2}>
                    Stop
                  </button>
                </h1>
              </div>
              <div className={styles.box}>
                <h1>
                  Pumpe 3
                  <button className={styles.button} onClick={start_3}>
                    Start
                  </button>
                  <button className={styles.button} onClick={stop_3}>
                    Stop
                  </button>
                </h1>
              </div>
            </div>
          )}
          {buttongroupstate === 1 && (
            <div className={styles.box}>
              <h1>
                Ventilator
                <button className={styles.button} onClick={start_4}>
                  Start
                </button>
                <button className={styles.button} onClick={stop_4}>
                  Stop
                </button>
              </h1>
            </div>
          )}
          {buttongroupstate === 2 && (
            <div className={styles.box}>
              <h1>
                Humidifyer
                <button className={styles.button} onClick={start_5}>
                  Start
                </button>
                <button className={styles.button} onClick={stop_5}>
                  Stop
                </button>
              </h1>
            </div>
          )}
          {buttongroupstate === 3 && (
            <div className={styles.box}>
              <h1>
                Roof
                <button className={styles.button} onClick={start_6}>
                  Start
                </button>
                <button className={styles.button} onClick={stop_6}>
                  Stop
                </button>
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actions;
