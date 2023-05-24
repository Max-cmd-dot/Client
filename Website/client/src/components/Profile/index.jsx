import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [userGroup, setUserGroup] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");
        //console.log(userId);
        const url = `https://20.219.193.229:8080/api/apiuserdata/${userId}`; // Update the URL

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { firstName, lastName, email, group } = response.data;

        setUserData({ firstName, lastName, email });
        setUserGroup(group);
        setLoading(false);
      } catch (error) {
        // Handle any error that occurred during the API request
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.userdata}>
          <div className={styles.box}>
            <h2>Name</h2>
            <p>
              {userData.firstName} {userData.lastName}
            </p>
          </div>
          <div className={styles.box}>
            <h2>Email</h2>
            <p>{userData.email}</p>
          </div>
          <div className={styles.box}>
            <h2>Work Group</h2>
            <p className={styles.textinbox}>{userGroup}</p>
          </div>
          {/* Additional sections */}
        </div>
      )}
    </div>
  );
};

export default Profile;
