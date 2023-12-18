import styles from "./styles.module.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import ButtonGroup from "../ButtonGroup/button-group";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
const apiUrl = process.env.REACT_APP_API_URL;

const Notifications = () => {
  const [list, setList] = useState([]);
  const groupId = localStorage.getItem("groupId");
  const [notificationtype, setNotificationType] = useState("alarms");
  const [notificationTypeFilter, setNotificationTypeFilter] = useState("all");
  const [releaseNotes, setReleaseNotes] = useState([]);
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();

  // Use another effect hook to dispatch changeRoute when the component mounts
  useEffect(() => {
    dispatch(changeRoute("/forecast"));
  }, [dispatch]); // Re-run the effect if dispatch changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(
            `${apiUrl}/api/notification/latestdata/notifications?groupId=${groupId}`
          ),
          axios.get(`${apiUrl}/api/notification/latestdata/github`),
        ]);

        const valuesArr = response1.data.map((item) => ({
          message: item.message,
          time: new Date(item.time).toISOString(), // Convert to ISO string
          group: item.group,
        }));

        const commitMessages = response2.data.map((commit) => ({
          date: new Date(commit.commit.author.date).toLocaleDateString(),
          message: commit.commit.message,
        }));

        setList(valuesArr);
        setReleaseNotes(commitMessages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [groupId, currentPage]);

  const systemNotifications = useMemo(
    () =>
      list.filter(
        (item) => item.message === "No data received in the last 15 minutes."
      ),
    [list]
  );
  const waterNotifications = useMemo(
    () =>
      list.filter(
        (item) =>
          item.message === "Soil moisture 1 to less!" ||
          item.message === "Soil moisture 2 to less!"
      ),
    [list]
  );
  function renderNotifications() {
    switch (notificationTypeFilter) {
      case "all":
        return list.map(renderNotification);
      case "system":
        return systemNotifications.map(renderNotification);
      case "water":
        return waterNotifications.map(renderNotification);
      default:
        return null;
    }
  }
  function renderNotification(item, index) {
    return (
      <div key={index}>
        <div className={styles.box}>
          <button
            className={styles.ignoreButton}
            onClick={() => handleIgnore(index)}
          >
            ignore
          </button>

          <h2 className={styles.h2}>{item.message}</h2>
          <p>
            {new Date(item.time).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <p>{item.group}</p>
        </div>
      </div>
    );
  }
  const handleIgnore = useCallback(
    async (index) => {
      try {
        let updatedList = [...list];
        if (index !== undefined) {
          const ignoredItem = updatedList[index];
          if (ignoredItem) {
            const formattedTime = new Date(ignoredItem.time);
            const response = await axios.post(
              `${apiUrl}/api/notification/notifications/ignore?groupId=${groupId}`,
              { time: formattedTime.toISOString() }
            );
            updatedList.splice(index, 1);
          }
        } else {
          const times = updatedList.map((item) =>
            new Date(item.time).toISOString()
          );
          const response = await axios.post(
            `${apiUrl}/api/notification/notifications/ignore?groupId=${groupId}`,
            { times }
          );
          updatedList = [];
        }
        setList(updatedList);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
    [list, groupId]
  );

  const printButtonLabel = (event) => {
    switch (event.target.name) {
      case "log":
        setNotificationType("log");
        break;
      case "release notes":
        setNotificationType("release notes");
        break;
      case "alarms":
        setNotificationType("alarms");
        break;
      default:
        break;
    }
  };
  const handleFilter = (filter) => {
    setNotificationTypeFilter(filter.target.name);
  };

  return (
    <div>
      <h1 className={styles.heading}>Notifications</h1>
      <div className={styles.box_container}>
        <div
          className={styles.buttonGroup}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <ButtonGroup
            buttons={["alarms", "log", "release notes"]}
            doSomethingAfterClick={printButtonLabel}
            activeButton={notificationtype}
            defaultActiveButton={0}
          />
          {notificationtype === "log" && list.length != 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "5px",
              }}
            >
              <ButtonGroup
                buttons={["all", "system", "water"]}
                doSomethingAfterClick={handleFilter}
                defaultActiveButton={0}
                activeButton={notificationTypeFilter}
                buttonSize={"15px"}
                buttonWidth={100}
                buttonHeight={40}
              />
            </div>
          ) : null}

          {notificationtype === "log" && list.length > 2 ? (
            <button
              className={styles.ignore_all}
              onClick={() => handleIgnore()}
              style={{ marginLeft: "auto" }}
            >
              Ignore all
            </button>
          ) : null}
          {list.length === 0 && notificationtype === "log" ? (
            <div className={styles.no_log}>No log data!</div>
          ) : null}
        </div>
        <div>{notificationtype === "log" ? renderNotifications() : null}</div>
        {notificationtype === "release notes" ? (
          <div>
            {releaseNotes.length > 0 ? (
              releaseNotes.map((note, index) => (
                <div key={index} className={styles.release_note}>
                  <span className={styles.release_note_date}>
                    [{note.date}]:{" "}
                  </span>
                  {note.message}
                </div>
              ))
            ) : (
              <div>
                Error fetching data. If this error presis, please contact the
                support!
              </div>
            )}
          </div>
        ) : null}
        {notificationtype === "alarms" ? (
          <div className={styles.alarms}> No active alarms!</div>
        ) : null}
      </div>
    </div>
  );
};

export default Notifications;
