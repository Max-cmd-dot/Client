import styles from "./styles.module.css";
import { Link } from "react-router-dom";
const NotFoundPage = () => {
  //Iot-Garden Automatisierung

  return (
    <div>
      <div className={styles.page}>
        <h1 className={styles.headings}>Page not Found</h1>
        <p>Sorry, we can not find the Page you are Looking for!</p>
        <p className={styles.error}>Error: 404</p>
        <Link to="/landing">
          <button className={styles.button}>Go back to Landing</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
