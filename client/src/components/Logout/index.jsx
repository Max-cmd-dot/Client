import React from "react";
import styles from "./styles.module.css";
import { changeRoute } from "../../reduxStore";
import Cookies from "js-cookie";

const Logout = ({ setIsLoggedIn }) => {
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent form submission
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("groupId");
    setIsLoggedIn(false);
    setTimeout(() => {
      window.location.href = "/Landing"; // Redirect to the landing page after a delay
    }, 100); // Delay of 100 milliseconds
  };

  // Use another effect hook to dispatch changeRoute when the component mounts
  const handlegoback = () => {
    changeRoute("/");
    // Redirecting to "/" page
    // Fixes the issue of not loading the main page data
    setTimeout(() => {
      window.location.href = "/"; // Redirect to the landing page after a delay
    }, 100); // Delay of 100 milliseconds
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container}>
            <h1>Log out?</h1>
            <button
              type="button"
              className={styles.green_btn}
              onClick={handleLogout}
            >
              Confirm
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>Nope?</h1>
          <button
            type="button"
            className={styles.white_btn}
            onClick={handlegoback}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
