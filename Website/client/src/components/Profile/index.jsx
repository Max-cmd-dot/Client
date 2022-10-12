import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
const Profile = () => {
  let [list, setList] = useState([]);
  console.log(list);

  //const userinfo = localStorage.getItem("id");
  //console.log(userinfo, "wtf");
  //const url = "http://20.219.193.229:8080/api/apiuserdata";
  //const { data: res } = axios.post(url, userinfo);
  //console.log(res);
  //setList(res);
  useEffect(() => {
    const userinfo = localStorage.getItem("id");
    //const datauser = `{"id": "${userinfo}"}`;
    const datauser = JSON.stringify({ id: userinfo });
    console.log(userinfo, "wtf");
    const url = "http://20.219.193.229:8080/api/apiuserdata";
    const customConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios.post(url, datauser, customConfig).then(function (response) {
      console.log(response);
      const dataArr = [];
      let counter = 0;
      for (let thing in response) {
        if (counter < 1)
          //because of 6 objekts
          dataArr.push({
            firstName: response[thing].firstName,
            lastName: response[thing].lastName,
            email: response[thing].email,
          });
        counter++;
      }
      setList(dataArr);
      console.log(dataArr);
    });
  }, []);
  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Profile</h1>
      <div className={styles.userdata}>
        <div className={styles.box}>
          <h2>Name</h2>
          <p>
            {list.map((list) => list.firstName)}{" "}
            {list.map((list) => list.lastName)}
          </p>
        </div>
        <div className={styles.box}>
          <h2>Email</h2>
          {list.map((list) => list.email)}
        </div>
        <div className={styles.box}>
          <h2>Group</h2>
          <p>admin</p>
        </div>
        <div className={styles.box}>
          <h2>Abonnements</h2>
          <p>all you have</p>
        </div>
      </div>
    </div>
  );
};
export default Profile;
