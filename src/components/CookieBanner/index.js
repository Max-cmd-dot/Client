import React, { useState } from "react";
import styles from "./styles.module.css";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  const acceptCookies = () => {
    // Here you would typically set a cookie in the user's browser indicating they've accepted cookies
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className={styles["cookie-banner"]}>
      <p>
        We use cookies to enhance your experience. By continuing to visit this
        site you agree to our use of cookies.
      </p>
      <button className={styles.button} onClick={acceptCookies}>
        I Understand
      </button>
    </div>
  );
};

export default CookieBanner;
