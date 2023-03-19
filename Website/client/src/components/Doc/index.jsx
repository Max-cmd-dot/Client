import styles from "./styles.module.css";
//import { Link } from "react-router-dom";
//import image from "c://Programm_React/Website/client/src/components/Pictures/sensor2.png";
//import image2 from "c://Programm_React/Website/client/src/components/Pictures/module2.png";
const Doc = () => {
  //Iot-Garden Automatisierung

  return (
    <div>
      <div className={styles.main_container}></div>
      <div>
        <h1 className={styles.h1}>Dokumentation</h1>
      </div>
      <div>
        <h2 className={styles.subheading}>Einführung</h2>
      </div>
      <div>
        <h2 className={styles.subheading}>Idee</h2>
      </div>
      <div>
        <h2 className={styles.subheading}>Installation</h2>
        <p1>Things to for complete install:</p1>
        <h3>general</h3>
        <h4>- ports</h4>
        <h4>- Windows as an os</h4>
        <h3>- mongodb</h3>
        <h3>- mosquitto</h3>
      </div>
      <div>
        <h2 className={styles.subheading}>Usage</h2>
        <p1>For Farming monitoring</p1>
      </div>
      <div>
        <h2>Architecture</h2>
      </div>
      <div>
        <h2 className={styles.subheading}>Credit</h2>
        <p1>Maximilian Nobis</p1>
      </div>
    </div>
  );
};

export default Doc;
