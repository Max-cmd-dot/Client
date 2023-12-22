import styles from "./styles.module.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import ButtonGroup from "../ButtonGroup/button-group";
import { changeRoute } from "../../reduxStore";
import { useSelector, useDispatch } from "react-redux";
import { FiSettings } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
const apiUrl = process.env.REACT_APP_API_URL;

const Notifications = () => {
  const [list, setList] = useState([]);
  const groupId = localStorage.getItem("groupId");
  const [notificationtype, setNotificationType] = useState("alarms");
  const [notificationTypeFilter, setNotificationTypeFilter] = useState("all");
  const [releaseNotes, setReleaseNotes] = useState([]);
  const currentPage = useSelector((state) => state.currentPage);
  const [isSettingsPopupVisible, setSettingsPopupVisibility] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //settings states
  const [tempMin, setTempMin] = useState();
  const [tempMax, setTempMax] = useState();
  const [moistureMin, setMoistureMin] = useState();
  const [moistureMax, setMoistureMax] = useState();
  const [emailNotification, setEmailNotification] = useState(); // Inside your component
  const [email, setEmail] = useState();
  const [isValid, setIsValid] = useState();

  const dispatch = useDispatch();

  // Use another effect hook to dispatch changeRoute when the component mounts
  useEffect(() => {
    dispatch(changeRoute("/forecast"));
  }, [dispatch]); // Re-run the effect if dispatch changes
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/group/settings`, {
          params: { groupId },
        });
        if (!response.data) {
          console.error("Error fetching settings: No settings in response");
          return;
        }
        const settingsArray = response.data;
        const settings = {};
        settingsArray.forEach((setting) => {
          const key = Object.keys(setting)[0];
          settings[key] = setting[key];
        });
        setTempMin(settings.tempMin);
        setTempMax(settings.tempMax);
        setMoistureMin(settings.moistureMin);
        setMoistureMax(settings.moistureMax);
        setEmailNotification(settings.emailNotification);
        setEmail(settings.email);
        setIsValid(settings.isValid);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);
  //settings popup
  const handleSettingsClick = () => {
    setSettingsPopupVisibility(true);
  };
  //handle close of settings
  const handleSettingsClose = () => {
    setSettingsPopupVisibility(false);
  };
  const handleEmailChange = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(e.target.value);
    setIsValid(emailRegex.test(e.target.value));
  };

  const handleSave = () => {
    setIsLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailNotification && !emailRegex.test(email)) {
      setIsValid(false);
      return;
    }

    // Create an array with all the settings to save
    const settings = [
      { tempMin: tempMin },
      { tempMax: tempMax },
      { moistureMin: moistureMin },
      { moistureMax: moistureMax },
      { emailNotification: emailNotification },
      { email: email },
      { isValid: isValid },
    ];

    // Send a PUT request to the /group/:id route
    axios
      .put(`${apiUrl}/api/group/update?groupId=${groupId}`, { settings })
      .then((response) => {
        setSaveStatus("Settings saved successfully.");
        setIsLoading(false);
      })
      .catch((error) => {
        setSaveStatus("Error saving settings.");
        setIsLoading(false);
      });
  };

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
        (item) => item.message === "No data received in the last 1 hour."
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
        <FiSettings
          onClick={handleSettingsClick}
          size={20}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1,
          }}
        />
        {isSettingsPopupVisible && (
          <div
            style={{
              display: "flex",
              position: "fixed",
              justifyContent: "center",
              alignItems: "center",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 4,
            }}
            onClick={handleSettingsClose}
          >
            <div
              style={{
                position: "relative",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                width: "80%",
                maxWidth: "500px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "black",
                }}
                onClick={handleSettingsClose}
              >
                X
              </button>
              <h2>Settings</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <label>
                  Temperature Min:
                  <input
                    type="number"
                    value={tempMin}
                    onChange={(e) => setTempMin(e.target.value)}
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      WebkitAppearance: "none",
                      marginLeft: "10px",
                    }}
                  />
                </label>
                <label>
                  Temperature Max:
                  <input
                    type="number"
                    value={tempMax}
                    onChange={(e) => setTempMax(e.target.value)}
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginLeft: "10px",
                    }}
                  />
                </label>
                <label>
                  Soil Moisture Min:
                  <input
                    type="number"
                    value={moistureMin}
                    onChange={(e) => setMoistureMin(e.target.value)}
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginLeft: "10px",
                    }}
                  />
                </label>
                <label>
                  Soil Moisture Max:
                  <input
                    type="number"
                    value={moistureMax}
                    onChange={(e) => setMoistureMax(e.target.value)}
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginLeft: "10px",
                    }}
                  />
                </label>
                <label>
                  Send Email Notification:
                  <input
                    type="checkbox"
                    checked={emailNotification}
                    onChange={(e) => setEmailNotification(e.target.checked)}
                    style={{ marginLeft: "10px" }}
                  />
                </label>

                {emailNotification && (
                  <div style={{ marginTop: "10px" }}>
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      style={{
                        padding: "5px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        marginLeft: "10px",
                      }}
                    />
                    {isValid ? (
                      <span style={{ color: "green" }}>✓</span>
                    ) : (
                      <span style={{ color: "red" }}>X</span>
                    )}
                  </div>
                )}
                <button className={styles.button} onClick={handleSave}>
                  Save
                </button>
                {saveStatus}
              </div>
            </div>
          </div>
        )}
        <div
          className={styles.buttonGroup}
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            pointerEvents: isSettingsPopupVisible ? "none" : "auto",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            {/*some space to the things beneath*/}
            <ButtonGroup
              buttons={["alarms", "log", "release notes"]}
              doSomethingAfterClick={printButtonLabel}
              activeButton={notificationtype}
              defaultActiveButton={0}
            />
          </div>

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
        {list.length === 0 && notificationtype === "log" ? (
          <div className={styles.noLog}>No log data!</div>
        ) : null}
        {notificationtype === "alarms" ? (
          <div className={styles.noAlarms}> No active alarms!</div>
        ) : null}
      </div>
    </div>
  );
};

export default Notifications;
