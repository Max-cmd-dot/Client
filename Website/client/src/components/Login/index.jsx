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
      const { data: res } = await axios.post(url, data, {
        withCredentials: true,
      });
      // Assuming server sets HttpOnly cookies for the token
      window.location.href = "/"; // Redirect immediately
    } catch (error) {
      let errorMessage;
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        errorMessage = "Invalid email or password.";
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
