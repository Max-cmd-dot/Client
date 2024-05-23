import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_API_URL;

const Devices = () => {
  const currentPage = useSelector((state) => state.currentPage);
  const groupId = Cookies.get("groupId");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeRoute("/devices"));
  }, [dispatch]);
  let [devices, setDevices] = useState([]);

  useEffect(() => {
    if (currentPage === "/devices") {
      const getDevices = async () => {
        const response = await axios.get(
          `${apiUrl}/api/devices?group=${groupId}`
        );
        console.log(apiUrl);
        const valuesArr = response.data.message.map((item) => ({
          deviceId: item.deviceId,
          type: item.type,
        }));
        setDevices(valuesArr);
      };
      getDevices();
      const interval = setInterval(() => {
        getDevices();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [currentPage, groupId]);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Devices</h1>
      <div className={styles.data}>
        {devices.map((item) => (
          <div key={item.deviceId}>
            <div className={styles.sensordata}>
              <div className={styles.elementssensordata}>
                <div className={styles.sensorheading}>{item.type}</div>
                <div className={styles.sensorvalue}>Id: {item.deviceId}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Devices;
