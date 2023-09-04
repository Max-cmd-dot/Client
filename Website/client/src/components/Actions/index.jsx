import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;
import ButtonGroup from "../ButtonGroup/button-group";

const Actions = () => {
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
        <h1 className={styles.box}>Test</h1>
        <h1 className={styles.box}>Test</h1>
        <h1 className={styles.box}>Test</h1>
        <h1 className={styles.box}>Test</h1>
      </div>
    </div>
  );
};

export default Actions;
