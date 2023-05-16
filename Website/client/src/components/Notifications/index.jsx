import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
const Notifications = () => {
  let [list, setList] = useState([]);
  //Iot-Garden Automatisierung
  useEffect(() => {
    axios
      .get("https://20.219.193.229:8080/api/data/latestdata/all")
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
  return (
    <div>
      <h1 className={styles.heading}>Notifications</h1>
      <div>
        <h3 className={styles.alerts}>Alerts</h3>
      </div>
      <div>
        <h4 className={styles.date}>Today</h4>
      </div>
      <div className={styles.userdata}>
        <div className={styles.box}>
          <h2>too little water</h2>
          <p className={styles.textinbox}>area 2</p>
        </div>
        <div className={styles.box}>
          <h2>plant</h2>
          <p className={styles.textinbox}>area 1</p>
        </div>
        <div className={styles.box}>
          <h2>fertilize </h2>
          <p className={styles.textinbox}>area 2</p>
        </div>
        {/*like stüffel*/}
        <div className={styles.box}>
          <h2>fertilize</h2>
          <p className={styles.textinbox}>area 1</p>
        </div>
      </div>
      <div>
        <h4 className={styles.date}>Yesterday</h4>
      </div>
      <div className={styles.userdata}>
        <div className={styles.box}>
          <h2>fertilize</h2>
          <p className={styles.textinbox}>area 2</p>
        </div>
        <div className={styles.box}>
          <h2>plant</h2>
          <p className={styles.textinbox}>area 1</p>
        </div>
        <div className={styles.box}>
          <h2>too little water </h2>
          <p className={styles.textinbox}>area 2</p>
        </div>
        {/*like stüffel*/}
        <div className={styles.box}>
          <h2>fertilize</h2>
          <p className={styles.textinbox}>area 1</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
