import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { changeRoute } from "../../reduxStore";

const Logout = () => {
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent form submission
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("groupId");
    setTimeout(() => {
      window.location.href = "/Landing"; // Redirect to the landing page after a delay
    }, 1000); // Delay of 1000 milliseconds (1 second)
  };
  // Use another effect hook to dispatch changeRoute when the component mounts
  const handlegoback = () => {
    changeRoute("/");
  };
  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container}>
            <h1>Are you sure you want to Log out?</h1>
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
          <Link to="/">
            <button
              type="button"
              className={styles.white_btn}
              onClick={handlegoback}
            >
              Go Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Logout;
