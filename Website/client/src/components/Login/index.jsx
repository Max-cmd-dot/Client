import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
const apiUrl = process.env.REACT_APP_API_URL;
const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${apiUrl}/api/auth`;
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data.token); // Store the authentication token in local storage
      localStorage.setItem("id", res.data.userId);
      localStorage.setItem("groupId", res.data.group);
      // Redirect the user to the desired page after successful login
      setTimeout(() => {
        window.location.href = "/"; // Redirect to the landing page after a delay
      }, 100); // Delay of 1000 milliseconds (1 second)
    } catch (error) {
      let errorMessage;
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = "An unexpected error occurred.";
      }
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Log in</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <div>
              <Link to="/password_reset">
                <button type="button" className={styles.forgotbutton}>
                  Forgot Password?
                </button>
              </Link>
            </div>
            <button type="submit" className={styles.green_btn}>
              Confirm
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New here?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
