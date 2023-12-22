import styles from "./styles.module.css";
import React, { useState, useEffect, memo, useCallback } from "react";
import axios from "axios";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
import { FiSettings } from "react-icons/fi";
const apiUrl = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Move Device outside of Actions
const Device = memo(
  ({ type, number, list2, toggleDevice, deviceCounts, groupId }) => {
    const deviceName = `${type}_${number || ""}`;
    const device = list2.find((item) => item.object === deviceName);
    const [isSettingsPopupVisible, setSettingsPopupVisibility] =
      useState(false);
    //settings icon
    // Helper function to split an object name into its type and number

    const [iconBg, setIconBg] = useState("transparent");
    //automations popup
    const [timeAutomations, setTimeAutomations] = useState([]);
    const [sensorAutomations, setSensorAutomations] = useState([]);

    useEffect(() => {
      const fetchAutomations = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/actions/get_automations?groupId=${groupId}&deviceName=${deviceName}`
          );
          if (
            Array.isArray(response.data.automations) &&
            response.data.automations.length > 0
          ) {
            const { timeAutomations, sensorAutomations } =
              response.data.automations[0];
            setTimeAutomations(timeAutomations);
            setSensorAutomations(sensorAutomations);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchAutomations();
    }, [groupId, deviceName]);

    const handleSave = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/actions/update`, {
          object: deviceName,
          group: groupId,
          automations: [
            {
              timeAutomations,
              sensorAutomations,
            },
          ],
        });

        alert("Data saved successfully");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Error saving data");
      }
    };
    const handleAddTimeAutomation = () => {
      setTimeAutomations([
        ...timeAutomations,
        { action: "on", time: "12:29", frequency: "every day" },
      ]);
    };

    const handleRemoveTimeAutomation = (index) => {
      setTimeAutomations(timeAutomations.filter((_, i) => i !== index));
    };

    const handleAddSensorAutomation = () => {
      setSensorAutomations([
        ...sensorAutomations,
        {
          action: "on",
          sensor: "temperature",
          condition: "above",
          value: "70",
        },
      ]);
    };

    const handleRemoveSensorAutomation = (index) => {
      setSensorAutomations(sensorAutomations.filter((_, i) => i !== index));
    };

    const handleInputChange = (e, index, setAutomations) => {
      const { name, value } = e.target;
      setAutomations((prev) =>
        prev.map((automation, i) =>
          i === index ? { ...automation, [name]: value } : automation
        )
      );
    };

    //handle click of settings
    const handleSettingsClick = () => {
      setSettingsPopupVisibility(!isSettingsPopupVisible);
      setIconBg(iconBg === "transparent" ? "gray" : "transparent");
    };

    if (!device) return null;
    const capitalizedType = capitalizeFirstLetter(type);
    return (
      <div className={styles.box}>
        <div style={{ position: "relative" }}>
          {/* Ensure the parent has a relative position */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: iconBg,
              borderRadius: "50%", // macht den Hintergrund kreisförmig
              width: "30px", // Breite des Kreises
              height: "30px", // Höhe des Kreises
              display: "flex", // zentriert das Icon
              alignItems: "center", // zentriert das Icon vertikal
              justifyContent: "center", // zentriert das Icon horizontal
            }}
          >
            <FiSettings
              onClick={handleSettingsClick}
              size={20}
              color={iconBg === "gray" ? "white" : "black"} // ändert die Farbe des Icons
            />
          </div>
        </div>
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {capitalizedType}
          {deviceCounts[type] > 1 && ` ${number}`}
          <button
            className={styles.button}
            onClick={() =>
              toggleDevice(deviceName, device.value === "on" ? "off" : "on")
            }
          >
            {device.value === "on" ? "Stop" : "Start"}
          </button>
        </h1>

        {isSettingsPopupVisible && (
          <div className={styles.settingsPopup}>
            <div className={styles.settingsPopupContent}>
              <div className={styles.automationsHeading}>
                <h2 className={styles.title}>Automations</h2>
              </div>
              <h4 className={styles.subtitle}>Turn on/off at specific times</h4>
              {timeAutomations.map((automation, index) => (
                <div key={index} className={styles.automation}>
                  <select
                    name="action"
                    value={automation.action}
                    onChange={(e) =>
                      handleInputChange(e, index, setTimeAutomations)
                    }
                    className={styles.select}
                  >
                    <option value="on">on</option>
                    <option value="off">off</option>
                  </select>
                  <span className={styles.text}>at</span>
                  <input
                    type="time"
                    name="time"
                    value={automation.time}
                    onChange={(e) =>
                      handleInputChange(e, index, setTimeAutomations)
                    }
                    className={styles.input}
                  />
                  <span className={styles.text}>every</span>
                  <select
                    type="text"
                    name="frequency"
                    value={automation.frequency}
                    onChange={(e) =>
                      handleInputChange(e, index, setTimeAutomations)
                    }
                    className={styles.input}
                  >
                    <option value="every day">every day</option>
                    <option value="weekdays">weekdays</option>
                    <option value="weekends">weekends</option>
                    <option value="monday">monday</option>
                    <option value="tuesday">tuesday</option>
                    <option value="wednesday">wednesday</option>
                    <option value="thursday">thursday</option>
                    <option value="friday">friday</option>
                    <option value="saturday">saturday</option>
                    <option value="sunday">sunday</option>
                  </select>
                  <button
                    onClick={() => handleRemoveTimeAutomation(index)}
                    className={styles.button}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddTimeAutomation}
                className={styles.addButton}
              >
                Add Time Automation
              </button>

              <h4 className={styles.subtitle}>
                Turn on/off when sensor is value is triggered
              </h4>
              {sensorAutomations.map((automation, index) => (
                <div key={index} className={styles.automation}>
                  <select
                    name="action"
                    value={automation.action}
                    onChange={(e) =>
                      handleInputChange(e, index, setSensorAutomations)
                    }
                    className={styles.select}
                  >
                    <option value="on">on</option>
                    <option value="off">off</option>
                  </select>
                  <span className={styles.text}>when</span>
                  <select
                    name="sensor"
                    value={automation.sensor}
                    onChange={(e) =>
                      handleInputChange(e, index, setSensorAutomations)
                    }
                    className={styles.select}
                  >
                    <option value="temperature">temperature</option>
                    <option value="co2">CO2</option>
                    <option value="water">water</option>
                  </select>
                  <span className={styles.text}>is</span>
                  <select
                    name="condition"
                    value={automation.condition}
                    onChange={(e) =>
                      handleInputChange(e, index, setSensorAutomations)
                    }
                    className={styles.select}
                  >
                    <option value="above">above</option>
                    <option value="less than">less than</option>
                  </select>
                  <span className={styles.text}>the value</span>
                  <input
                    type="number"
                    name="value"
                    value={automation.value}
                    onChange={(e) =>
                      handleInputChange(e, index, setSensorAutomations)
                    }
                    className={styles.input}
                  />
                  <button
                    onClick={() => handleRemoveSensorAutomation(index)}
                    className={styles.button}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddSensorAutomation}
                className={styles.addButton}
              >
                Add Sensor Automation
              </button>
              <br></br>
              <button className={styles.button} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
const countDevices = (list) => {
  const counts = {};
  list.forEach((item) => {
    const type = item.object.split("_")[0];
    counts[type] = (counts[type] || 0) + 1;
  });
  return counts;
};

const Actions = () => {
  const groupId = localStorage.getItem("groupId");
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  const [list2, setList2] = useState([]);
  const deviceCounts = countDevices(list2) || {}; // provide an empty object as the default value

  const sortedList = list2.reduce((acc, item) => {
    const [type, number] = item.object.split("_");
    const capitalizedType = capitalizeFirstLetter(type);
    const newItem = { ...item, type, number, capitalizedType };
    const insertIndex = acc.findIndex(
      (accItem) =>
        accItem.type > newItem.type ||
        (accItem.type === newItem.type &&
          parseInt(accItem.number) > parseInt(newItem.number))
    );
    if (insertIndex === -1) {
      acc.push(newItem);
    } else {
      acc.splice(insertIndex, 0, newItem);
    }
    return acc;
  }, []);
  //set page to /actions
  useEffect(() => {
    dispatch(changeRoute("/actions"));
  }, [dispatch]);

  const toggleDevice = useCallback(
    (device, value) => {
      axiosInstance
        .get(`/api/actions/?group=${groupId}&object=${device}&value=${value}`)
        .then(fetchData_current_state);
    },
    [groupId]
  );

  const fetchData_current_state = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/api/actions/current_state?group=${groupId}`
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
  }, [groupId]);

  useEffect(() => {
    if (currentPage === "/actions") {
      fetchData_current_state();
      const interval = setInterval(fetchData_current_state, 2000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentPage, groupId, fetchData_current_state]);

  return (
    <div className={styles.main_container}>
      <h1 className={styles.h1}>Actions</h1>
      <div className={styles.current_state}>
        <div className={styles.data}>
          {sortedList.map((item) => {
            const type = item.object.split("_")[0];
            const number = item.object.split("_")[1];
            const heading =
              deviceCounts[type] > 1
                ? `${type.charAt(0).toUpperCase() + type.slice(1)} ${number}`
                : type.charAt(0).toUpperCase() + type.slice(1);
            return (
              <div className={styles.sensordata} key={item.object}>
                <div className={styles.elementssensordata}>
                  <h2 className={styles.sensorheading}>{heading}</h2>
                  <p
                    className={`${styles.sensorvalue} ${
                      item.value === "on" ? styles.on : styles.off
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.box_gray}>
        <div>
          {sortedList.map((item) => {
            return (
              <Device
                key={item.object}
                type={item.type}
                number={item.number}
                list2={list2}
                toggleDevice={toggleDevice}
                handleDeviceClick={() => handleDeviceClick(item)}
                deviceCounts={deviceCounts}
                groupId={groupId}
              />
            );
          })}
        </div>
      </div>
      <br></br>
    </div>
  );
};

export default Actions;
