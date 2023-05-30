import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://20.219.193.229:8080/api/auth";
      const { data: res } = await axios.post(url, data);

      localStorage.setItem("token", res.data.token); // Store the authentication token in local storage
      localStorage.setItem("id", res.data.userId);
      localStorage.setItem("groupId", res.data.group);
      //console.log(res);
      //console.log(res.data);
      //console.log(res.data.token);
      //console.log(res.data.userId);
      //console.log(res.data.group);
      // Redirect the user to the desired page after successful login
      window.location = "/"; // Replace "/" with the appropriate route for your application
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Log in to your Account</h1>
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
              Sing Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
