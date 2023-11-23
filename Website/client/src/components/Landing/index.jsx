import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import image1 from "../images/sensor2.png";

import dashboard from "../images/pages/dashboard.png";
import actions from "../images/pages/actions.png";
import notifications from "../images/pages/notifications.png";
import history from "../images/pages/history.png";

import logo from "../images/logo.png";
import { changeRoute } from "../../reduxStore";
const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handlegoback = () => {
    changeRoute("/");
    //redirecting to "/" page
    //fixes the issue of not loadingt the main page data
    setTimeout(() => {
      window.location.href = "/"; // Redirect to the landing page after a delay
    }, 100); // Delay of 1000 milliseconds (1 second)
  };
  useEffect(() => {
    // Check if user is logged in based on userId in local storage
    const userId = localStorage.getItem("id");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const renderButton = () => {
    if (isLoggedIn) {
      return (
        <button
          type="button"
          className={styles.white_btn}
          onClick={handlegoback}
        >
          Go Back
        </button>
      );
    } else {
      return (
        <Link to="/login">
          <button type="button" className={styles.white_btn}>
            Log in
          </button>
        </Link>
      );
    }
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      ></link>
      <div className={styles.hero_section}>
        <div className="Button">{renderButton()}</div>
        <div className={styles.logo_and_heading}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h1 className={styles.project_name}>Nexa Harvest</h1>
        </div>
        <div className={styles.hero_content}>
          <h1 className={styles.info3words}>Future, Efficiency, Planting</h1>
          <img src={image1} alt="Hero" className={styles.img} />
        </div>
      </div>
      <section className={styles.info_section}>
        <h2>OUR MISSION</h2>
        <p>
          Revolutionizing the Contemporary Home Cultivation Experience is Our
          Mission. At Nexa Harvest, we are dedicated to empowering individuals
          to cultivate plants in the comfort of their own living rooms to a
          standard that was once exclusive to large-scale enterprises. Our
          relentless pursuit of excellence drives us to continuously enhance
          both our software and hardware, tailored precisely to meet the unique
          desires of our customers. We go beyond the limitations of existing
          products, filling gaps, and providing exactly what people need.
        </p>
      </section>
      <section className={styles.info_section}>
        <div className={styles.row}>
          <div className={styles.column}>
            <h3>See the History</h3>
            <img src={history} alt="history" className={styles.pages} />
          </div>
          <div className={styles.column}>
            <h3>Get Notifications</h3>
            <img src={notifications} alt="dashboard" className={styles.pages} />
          </div>
          <div className={styles.column}>
            <h3>Take Actions</h3>
            <img src={actions} alt="actions" className={styles.pages} />
          </div>
          <div className={styles.column}>
            <h3>Clear Dashboard</h3>
            <img src={dashboard} alt="dashboard" className={styles.pages} />
          </div>
        </div>
      </section>
      <section className={styles.info_section}>
        <div className={styles.flex_container}>
          <div className={styles.centered_list}>
            <div>
              <h2>Pros of Nexa Harvest</h2>
            </div>
            <div>
              <ul className={styles.custom_list}>
                <li>Real-time monitoring and control</li>
                <li>Comprehensive data analysis</li>
                <li>Accessible from anywhere</li>
                <li>Secure and reliable communication</li>
              </ul>
            </div>
          </div>
          <div className={styles.centered_list}>
            <div>
              <h2>Applications</h2>
            </div>
            <div>
              <ul className={styles.custom_list}>
                <li>Smart Home</li>
                <li>Industry 4.0</li>
                <li>logistics and supply chain</li>
                <li>Environmental monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.info_section}>
        <div className={styles.contact_box}>
          <h2>Ready to take advantage of Nexa Harvest?</h2>
          <p>
            Contact us today to learn more about our IoT solution. or request a
            customized demo. Boost Improve your efficiency, improve your
            processes and stay ahead of the curve. one step ahead of the
            competition.
          </p>
          <button
            href="mailto:maximilian.nobis@nexaharvest.com"
            className={styles.contact_btn}
          >
            Contact
          </button>
        </div>
      </section>
      <section className={styles.info_section}>
        <footer className={styles.footer}>
          <Link to="/impressum">Impressum</Link>
          <Link to="/agb">AGB</Link>
        </footer>
      </section>
    </div>
  );
};
/*

.info_text {
  width: 40%;
  padding: 20px;
  text-align: left;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #39395f;
  color: #f5eec2;
  font-size: 18px; 
  line-height: 1.5;
  margin-bottom: 70px; 
}

.info_text.vorteile {
  width: 40%; 
  height: 250px; 
  padding: 20px;
  text-align: left;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #39395f;
  color: #f5eec2;
  margin-left: auto; 
}

.info_text h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #2d8adb;
}

.info_text p,
.info_text ul {
  font-size: 20px;
}

.info_text ul {
  margin-left: 20px;
}

.info_text li {
  margin-bottom: 10px;
}

.info_text {
  width: 40%;
  padding: 20px;
  text-align: left;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #39395f;
  color: #f5eec2;
  font-size: 18px; 
  margin-bottom: 70px; 
}

.info_text.vorteile {
  width: 40%; 
  height: 250px; 
  padding: 20px;
  text-align: left;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #39395f;
  color: #f5eec2;
  margin-left: auto; 
}

.info_text h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #2d8adb;
}

.info_text p,
.info_text ul {
  font-size: 20px;
}

.info_text ul {
  margin-left: 20px;
}

.info_text li {
  margin-bottom: 10px;
}
<div className={styles.info_section}>
        <div className={styles.info_container}>
          <div className={styles.info_text}>
            <h2>Was ist Nexa Harvest?</h2>
            <p>
              Nexa Harvest ist eine umfassende IoT-Lösung, die speziell
              entwickelt wurde, um Sensordaten zu erfassen, zu überwachen und zu
              analysieren. Durch die Integration von Sensoren, einer
              leistungsstarken Mikrocontroller-Plattform und Cloud-Konnektivität
              ermöglicht unser System die nahtlose Erfassung und Verarbeitung
              von Daten in Echtzeit.
            </p>
          </div>
          <div className={`${styles.info_text} ${styles.vorteile}`}>
            <h2>Vorteile von Nexa Harvest</h2>
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
            <h2>Bereit, die Vorteile von Nexa Harvest zu nutzen?</h2>
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
      </div>
*/
export default Landing;
