import styles from "./styles.module.css";
import { Link } from "react-router-dom";
const NotFoundPage = () => {
  //Iot-Garden Automatisierung

  return (
    <div>
      <div className={styles.page}>
        <h1 className={styles.headings}>page not found</h1>
        <p>Sorry, we can not find the page you are looking for!</p>
        <p className={styles.error}>Error: 404</p>
        <Link to="/landing">
          <button className={styles.button}>Go back to landing</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
