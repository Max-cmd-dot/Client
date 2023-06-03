import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import React, { useState } from "react";
import { useParams } from "react-router";
const apiUrl = process.env.REACT_APP_API_URL;
const Reset_Password = () => {
  const [data, setData] = useState({
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userId, token } = useParams();
  //console.log(userId);
  //console.log(token);
  const handleChange = ({ currentTarget: input }) => {
    setData({
      ...data,
      [input.name]: input.value,
      _id: userId,
      token: token,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${apiUrl}/api/password-reset/resetvalidate`;
      console.log(data);
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      //console.log(res.message);
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
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Set new Password</h1>
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
            <button type="submit" className={styles.green_btn}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset_Password;
