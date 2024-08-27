import styles from "./styles.module.css";
const Imprint = () => {
  //Iot-Garden Automatisierung

  return (
    <div>
      <div className={styles.main_container}></div>
      <div>
        <h1>Impressum</h1>

        <p>
          Maximilian Nobis
          <br />
          Immenhorstweg 76
          <br />
          22395 Hamburg
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: +4915207172533
          <br />
          E-Mail: max.nobishh@gmail.com
        </p>

        <p>
          Quelle:{" "}
          <a href="https://www.e-recht24.de">https://www.e-recht24.de</a>
        </p>
      </div>
      <div className={styles.filereaderbox}></div>
    </div>
  );
};

export default Imprint;
