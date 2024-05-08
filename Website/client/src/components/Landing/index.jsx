import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import image1 from "../images/sensor2.jpeg";
import { FaBars } from "react-icons/fa";
//images of pages
import dashboard from "../images/pages/dashboard.png";
import actions from "../images/pages/actions.png";
import notifications from "../images/pages/notifications.png";
import history from "../images/pages/history.png";
import logo from "../images/logo.png";
import { changeRoute } from "../../reduxStore";

const Landing = () => {
  const [buttonText, setButtonText] = useState("Contact");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          className={`${styles.white_btn} ${sidebarOpen ? styles.open : ""}`}
          onClick={handlegoback}
        >
          Go Back
        </button>
      );
    } else {
      return (
        <Link to="/login">
          <button
            type="button"
            className={`${styles.white_btn} ${sidebarOpen ? styles.open : ""}`}
          >
            LOG IN
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
        <div className={styles.logo_and_heading}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h1 className={styles.project_name}>Nexaharvest</h1>
        </div>
        <button
          className={`${styles.menuButton} ${sidebarOpen ? styles.open : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
        <div>
          <a
            href="https://shop.nexaharvest.com"
            className={`${styles.shopButton} ${sidebarOpen ? styles.open : ""}`}
          >
            SHOP
          </a>
          <Link
            to="/product"
            className={`${styles.productButton} ${
              sidebarOpen ? styles.open : ""
            }`}
          >
            PRODUCT
          </Link>
          <Link
            to="/contact"
            className={`${styles.contactButton} ${
              sidebarOpen ? styles.open : ""
            }`}
          >
            CONTACT
          </Link>
          <div className="Button">{renderButton()}</div>
        </div>
        <div
          className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}
        ></div>
        <div className={styles.square}></div>
        <div className={styles.hero_content}>
          <h1 className={styles.info3words}>Efficient, Futuristic Planting</h1>
          <img src={image1} alt="Hero sensor image" className={styles.img} />
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
            onClick={(e) => {
              window.location = "mailto:info@nexaharvest.com";
              setButtonText("info@nexaharvest.com");
              e.preventDefault();
            }}
            className={styles.contact_btn}
          >
            {buttonText}
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
export default Landing;
