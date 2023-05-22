import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import image1 from "../images/sensor2.png";
import image2 from "../images/module2.png";

const Landing = () => {
  return (
    <div>
      <div className={styles.navbar}>
        <h1>Plant</h1>
        <Link to="/login">
          <button type="button" className={styles.white_btn}>
            Log in
          </button>
        </Link>
      </div>

      <div className={styles.hero_section}>
        <img src={image1} alt="Hero" className={styles.img} />
        <div className={styles.hero_text}>
          <h1 className={styles.info3words}>Future, Efficiency, Planting</h1>
        </div>
      </div>

      <div className={styles.info_section}>
        <div className={styles.info_container}>
          <div className={styles.info_text}>
            <h2>Was ist Projekt XYZ?</h2>
            <p>
              Projekt XYZ ist eine umfassende IoT-Lösung, die speziell
              entwickelt wurde, um Sensordaten zu erfassen, zu überwachen und zu
              analysieren. Durch die Integration von Sensoren, einer
              leistungsstarken Mikrocontroller-Plattform und Cloud-Konnektivität
              ermöglicht unser System die nahtlose Erfassung und Verarbeitung
              von Daten in Echtzeit.
            </p>
          </div>

          <div className={styles.info_text}>
            <h2>Vorteile von Projekt XYZ</h2>
            <ul>
              <li>Echtzeitüberwachung und -steuerung</li>
              <li>Umfassende Datenanalyse</li>
              <li>Skalierbare Architektur</li>
              <li>Sichere und zuverlässige Kommunikation</li>
              <li>Benutzerfreundliche Schnittstelle</li>
            </ul>
          </div>

          <div className={styles.info_text}>
            <h2>Anwendungsbereiche</h2>
            <ul>
              <li>Smart Home</li>
              <li>Industrie 4.0</li>
              <li>Logistik und Lieferkette</li>
              <li>Umweltüberwachung</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.contact_section}>
        <h2>Kontaktieren Sie uns noch heute!</h2>
        <Link to="/contact">
          <button type="button" className={styles.contact_btn}>
            Kontakt
          </button>
        </Link>
      </div>

      <footer className={styles.footer}>
        <Link to="/impressum">Impressum</Link>
        <Link to="/agb">AGB</Link>
      </footer>
    </div>
  );
};

export default Landing;
