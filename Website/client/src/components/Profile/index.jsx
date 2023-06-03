import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
const apiUrl = process.env.REACT_APP_API_URL;

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [userGroup, setUserGroup] = useState("");
  const [groupAbo, setgroupAbo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");
        //console.log(userId);
        const url = `${apiUrl}/api/apiuserdata/${userId}`; // Update the URL

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { firstName, lastName, email, group } = response.data;

        setUserData({ firstName, lastName, email });
        setUserGroup(group);
        const abo = await Abo(group);
        setgroupAbo(abo);
        setLoading(false);
      } catch (error) {
        // Handle any error that occurred during the API request
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const Abo = async (group) => {
    try {
      const url = `${apiUrl}/api/group/abo?group=${group}`;
      const response = await axios.get(url);
      return response.data.package;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Profile</h1>
      {loading ? (
        <div className={styles.loading}>
          <ClipLoader size={150} className={styles.heading} />
        </div>
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
          <div className={styles.box}>
            <h2>Abo</h2>
            <p className={styles.textinbox}>{groupAbo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
