import styles from "./styles.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonGroup from "../ButtonGroup/button-group";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;
const Notifications = () => {
  const [list, setList] = useState([]);
  const groupId = localStorage.getItem("groupId");
  const [notificationtype, setnotificationtype] = useState("alerts");
  const [releaseNotes, setReleaseNotes] = useState("Comming soon");
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();
  // Use another effect hook to dispatch changeRoute when the component mounts
  useEffect(() => {
    dispatch(changeRoute("/forecast"));
  }, [dispatch]); // Re-run the effect if dispatch changes
  useEffect(() => {
    if (currentPage === "/forecast") {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/notification/latestdata/notifications?groupId=${groupId}`
          );
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
    }
  }, [groupId, currentPage]);

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
  const printButtonLabel = (event) => {
    if (event.target.name === "alerts") {
      setnotificationtype("alerts");
    }
    if (event.target.name === "release notes") {
      setnotificationtype("release_notes");
    }
    if (event.target.name === "messages") {
      setnotificationtype("messages");
    }
  };
  useEffect(() => {
    fetch(
      "https://api.github.com/repos/Max-cmd-dot/BLL/commits?sha=main&per_page=10"
    )
      .then((response) => response.json())
      .then((data) => {
        const commitMessages = data.map((commit) => ({
          date: new Date(commit.commit.author.date).toLocaleDateString(),
          message: commit.commit.message,
        }));
        setReleaseNotes(commitMessages);
      });
  }, []);
  return (
    <div>
      <h1 className={styles.heading}>Notifications</h1>
      <div className={styles.box_container}>
        <div className={styles.buttonGroup}>
          <ButtonGroup
            buttons={["alerts", "release notes", "messages"]}
            doSomethingAfterClick={printButtonLabel}
            defaultActiveButton={0}
          />
        </div>
        {notificationtype === "alerts" ? (
          <div>
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
        ) : (
          <div></div>
        )}
        {notificationtype === "release_notes" ? (
          <div>
            {releaseNotes.map((note, index) => (
              <div key={index} className={styles.release_note}>
                <span className={styles.release_note_date}>
                  [{note.date}]:{" "}
                </span>
                {note.message}
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
        {notificationtype === "messages" ? (
          <div className={styles.messages}>Comming soon</div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
