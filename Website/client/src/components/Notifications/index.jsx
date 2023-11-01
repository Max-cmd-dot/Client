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
  const [notificationtype, setnotificationtype] = useState("alarms");
  const [notificationtype_filter, setnotificationtype_filter] = useState("all");
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
  useEffect(() => {
    if (currentPage === "/forecast") {
      const fetchData_alarms = async () => {
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

      fetchData_alarms();
      const interval = setInterval(fetchData_alarms, 5000);

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

  const handleDeleteAll = async () => {
    try {
      // Perform the delete request to your backend API with the formatted time for each item in the list
      await Promise.all(
        list.map(async (item) => {
          const formattedTime = new Date(item.time);
          await axios.post(
            `${apiUrl}/api/notification/notifications/ignore?groupId=${groupId}`,
            { time: formattedTime.toISOString() }
          );
        })
      );

      // Clear the list
      setList([]);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  const printButtonLabel = (event) => {
    if (event.target.name === "log") {
      setnotificationtype("log");
    }
    if (event.target.name === "release notes") {
      setnotificationtype("release_notes");
    }
    if (event.target.name === "alarms") {
      setnotificationtype("alarms");
    }
  };
  const handleFilter = (filter) => {
    setnotificationtype_filter(filter.target.name);
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
                activeButton={notificationtype_filter}
                buttonSize={"15px"}
                buttonWidth={100}
                buttonHeight={40}
              />
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            ></div>
          )}

          {notificationtype === "log" && list.length > 2 ? (
            <button
              className={styles.delete_all}
              onClick={handleDeleteAll}
              style={{ marginLeft: "auto" }}
            >
              Delete All
            </button>
          ) : null}
          {list.length === 0 && notificationtype === "log" ? (
            <div className={styles.no_log}>No log data!</div>
          ) : null}
        </div>
        <div>
          {notificationtype === "log" ? (
            <div>
              {notificationtype_filter === "all" ? (
                <div>
                  {list.map((item, index) => (
                    <div>
                      <div className={styles.box} key={index}>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(index)}
                        >
                          ignore
                        </button>

                        <h2>{item.message}</h2>
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
                  ))}
                </div>
              ) : notificationtype_filter === "system" ? (
                <div>
                  {list.map((item, index) => (
                    <div>
                      {item.message ===
                      "No data received in the last 15 minutes." ? (
                        <div className={styles.box} key={index}>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(index)}
                          >
                            x
                          </button>

                          <h2>{item.message}</h2>
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
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : notificationtype_filter === "water" ? (
                <div>
                  {list.map((item, index) => (
                    <div>
                      {item.message === "Soil moisture 1 to less!" ||
                      item.message === "Soil moisture 2 to less!" ? (
                        <div className={styles.box} key={index}>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(index)}
                          >
                            x
                          </button>

                          <h2>{item.message}</h2>
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
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
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
        {notificationtype === "alarms" ? (
          <div className={styles.alarms}> No active alarms!</div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
