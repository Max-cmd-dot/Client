import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const Notifications = () => {
  const [list, setList] = useState([]);
  const groupId = localStorage.getItem("groupId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/notification/latestdata/notifications?groupId=${groupId}`
        );
        console.log(response);
        const valuesArr = response.data.map((item) => ({
          message: item.message,
          time: new Date(item.time).toISOString(), // Convert to ISO string
          group: item.group,
        }));

        setList(valuesArr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [groupId]);

  const handleDelete = async (index) => {
    const deletedItem = list[index];

    try {
      const formattedTime = new Date(deletedItem.time);
      // Perform the delete request to your backend API with the formatted time
      await axios.post(
        `${apiUrl}/api/notification/notifications/ignore?groupId=${groupId}`,
        { time: formattedTime.toISOString() }
      );

      // Remove the deleted item from the list
      const updatedList = [...list];
      updatedList.splice(index, 1);
      setList(updatedList);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <h1 className={styles.heading}>Notifications</h1>
      <div>
        <h3 className={styles.alerts}>Alerts</h3>
      </div>
      {list.map((item, index) => (
        <div className={styles.box} key={index}>
          <button
            className={styles.deleteButton}
            onClick={() => handleDelete(index)}
          >
            x
          </button>
          <h2>{item.message}</h2>
          <p>{item.time}</p>
          <p>{item.group}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
