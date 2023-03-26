import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import image from "../images/sensor2.png";
import image2 from "../images/module2.png";
const Landing = () => {
  //Iot-Garden Automatisierung

  return (
    <div>
      <div className={styles.main_container}>
        <nav className={styles.navbar}>
          <h1>Plant</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Log in
            </button>
          </Link>
        </nav>

        <div className={styles.picture1}>
          <img src={image} alt="Sensor im Boden" className={styles.img} />
          <h2 className={styles.info3words}>Future, Planting, Efficiency</h2>
        </div>
        <div className={styles.picture2}>
          <img src={image2} alt="Sensor Controller" className={styles.img} />
          <Link to="/doc">
            <button type="submit" className={styles.infotext}>
              Text about lorem ipsum dolor
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
