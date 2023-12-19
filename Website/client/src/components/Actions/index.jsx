import styles from "./styles.module.css";
import React, { useState, useEffect, memo, useCallback } from "react";
import axios from "axios";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  baseURL: apiUrl,
});
// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Move Device outside of Actions
const Device = memo(({ type, number, list2, toggleDevice, deviceCounts }) => {
  const deviceName = `${type}_${number || ""}`;
  const device = list2.find((item) => item.object === deviceName);

  if (!device) return null;
  const capitalizedType = capitalizeFirstLetter(type);
  return (
    <div className={styles.box}>
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
    </div>
  );
});
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

  // Helper function to split an object name into its type and number
  const splitObject = (object) => {
    const [type, number] = object.split("_");
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return { type, number, capitalizedType };
  };

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
          {sortedList.map((item, index) => {
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
                deviceCounts={deviceCounts}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Actions;
