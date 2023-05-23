import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import image1 from "../images/sensor2.png";
import image2 from "../images/module2.png";

const Landing = () => {
  return (
    <div>
      <div className={styles.hero_section}>
        <div className={styles.login_button}>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Log in
            </button>
          </Link>
        </div>
        <h1 className={styles.project_name}>Projekt XYZ</h1>
        <div className={styles.hero_content}>
          <h1 className={styles.info3words}>Future, Efficiency, Planting</h1>
          <img src={image1} alt="Hero" className={styles.img} />
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
          <div className={`${styles.info_text} ${styles.vorteile}`}>
            <h2>Vorteile von Projekt XYZ</h2>
            <ul>
              <li>Echtzeitüberwachung und -steuerung</li>
              <li>Umfassende Datenanalyse</li>
              <li>Skalierbare Architektur</li>
              <li>Sichere und zuverlässige Kommunikation</li>
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
          <div className={`${styles.info_text} ${styles.contact_box}`}>
            <h2>Bereit, die Vorteile von Projekt XYZ zu nutzen?</h2>
            <p>
              Kontaktieren Sie uns noch heute, um mehr über unsere IoT-Lösung zu
              erfahren oder eine maßgeschneiderte Demo anzufordern. Steigern Sie
              Ihre Effizienz, verbessern Sie Ihre Prozesse und bleiben Sie der
              Konkurrenz einen Schritt voraus.
            </p>
            <a
              href="mailto:your-email@example.com"
              className={styles.contact_btn}
            >
              Kontakt
            </a>
          </div>
        </div>

        <footer className={styles.footer}>
          <Link to="/impressum">Impressum</Link>
          <Link to="/agb">AGB</Link>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
