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
  useEffect(() => {
    dispatch(changeRoute("/actions"));
  }, [dispatch]);

  const handleButtonWater = () => {
    console.log("Water");
  };
  const handleAir = () => {
    console.log("Air");
  };
  const handleSunshine = () => {
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
  };
  const start_2 = () => {
    //post request to url with data = "pump 2 on"
    axios.get(`${apiUrl}/api/actions/?group=${groupId}&object=pump_2&value=on`);
  };
  const start_3 = () => {
    //post request to url with data = "pump 3 on"
    axios.get(`${apiUrl}/api/actions/?group=${groupId}&object=pump_3&value=on`);
  };
  const start_4 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=ventilator_1&value=on`
    );
  };
  const start_5 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(
      `${apiUrl}/api/actions/?group=${groupId}&object=humidifyer_1&value=on`
    );
  };
  const start_6 = () => {
    //post request to url with data = "pump 1 on"
    axios.get(`${apiUrl}/api/actions/?group=${groupId}&object=roof_1&value=on`);
  };
  return (
    <div className={styles.main_container}>
      <h1 className={styles.h1}>Actions</h1>
      <div className={styles.box_gray}>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            buttons={["Water", "Air", "Sunshine"]}
            doSomethingAfterClick={printButtonLabel}
            defaultActiveButton={0}
            overrideBoxColor={true}
            overrideButtonColor={false}
          />
        </div>
        <div>
          <div className={styles.box}>
            <h1>
              Pumpe 1
              <button className={styles.button} onClick={start_1}>
                Start
              </button>
            </h1>
          </div>
          <div className={styles.box}>
            <h1>
              Pumpe 2
              <button className={styles.button} onClick={start_2}>
                Start
              </button>
            </h1>
          </div>
          <div className={styles.box}>
            <h1>
              Pumpe 3
              <button className={styles.button} onClick={start_3}>
                Start
              </button>
            </h1>
          </div>
          <div className={styles.box}>
            <h1>
              Ventilator
              <button className={styles.button} onClick={start_4}>
                Start
              </button>
            </h1>
          </div>
          <div className={styles.box}>
            <h1>
              Humidifyer
              <button className={styles.button} onClick={start_5}>
                Start
              </button>
            </h1>
          </div>
          <div className={styles.box}>
            <h1>
              Roof
              <button className={styles.button} onClick={start_6}>
                Start
              </button>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;
