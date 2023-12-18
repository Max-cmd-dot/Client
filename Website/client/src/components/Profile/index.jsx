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
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const groupId = localStorage.getItem("groupId");
  const [groupEmployees, setGroupEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [rightabo, setRightabo] = useState(false);
  //const for e-mail popup
  const [isEmailPopupOpen_1, setIsEmailPopupOpen_1] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [isValid, setIsValid] = useState(false);

  //deletion of employees coming soon for enterprise users
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = () => {
    // Perform the delete action here
    console.log("Deleting employee:", selectedEmployee);

    // Close the delete popup
    setIsDeletePopupOpen(false);
  };

  const handleCancelDelete = () => {
    // Cancel the delete action
    setSelectedEmployee(null);
    setIsDeletePopupOpen(false);
  };
  const group = localStorage.getItem("groupId");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/group/abo?group=${group}`
        );
        setRightabo(response.data.package);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 100000);

    return () => {
      clearInterval(interval);
    };
  }, [rightabo]);
  useEffect(() => {
    //daten für oben
    const fetchData = async () => {
      try {
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
  if (rightabo === "medium") {
    useEffect(() => {
      //daten für unten
      const fetchGroupEmployeesData = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/group/abo?group=${groupId}`
          );
          console.log(response.data);
          const employeesArray = response.data.employee;
          //const employeesArray = JSON.parse(employeesString); // Parse the string into an array
          setGroupEmployees(employeesArray);
        } catch (error) {
          // Handle any error that occurred during the API request
          setLoading(false);
        }
      };

      fetchGroupEmployeesData();
      const interval = setInterval(fetchGroupEmployeesData, 5000);

      return () => {
        clearInterval(interval);
      };
    }, [groupId]);
  }
  const Abo = async (group) => {
    try {
      const url = `${apiUrl}/api/group/abo?group=${group}`;
      const response = await axios.get(url);
      if (response.data.package === "small") {
        return "Default";
      } else if (response.data.package === "medium") {
        return "Premium";
      } else if (response.data.package === "big") {
        return "Enterprise";
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const openEmailPopup_1 = () => {
    setIsEmailPopupOpen_1(true);
  };
  const closeEmailPopup_1 = () => {
    setIsEmailPopupOpen_1(false);
  };
  const handleEmailChange = async (event) => {
    console.log(event); // Add this line
    console.log(event.target); // Add this line
    event.preventDefault();
    console.log("Changing email to:", email);
    const newEmail = email;
    try {
      console.log("Changing email to:", newEmail);
      const response = await axios.post(`${apiUrl}/api/changeEmail/${userId}`, {
        newEmail: newEmail,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        window.location.href = "/Profile"; // Redirect to the landing page after a delay
      }, 1000); // Delay of 1000 milliseconds (1 second)
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };
  const handleConfirmEmailChange = (e) => {
    setConfirmEmail(e.target.value);
    setIsMatching(e.target.value === email);
  };
  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
    console.log(email);
    setIsValid(e.target.value.includes("@") && e.target.value.includes("."));
  };
  return (
    <div className={styles.main_container}>
      <h1 className={styles.heading}>Profile</h1>
      {loading ? (
        <div className={styles.loading}>
          <ClipLoader size={150} className={styles.heading} />
        </div>
      ) : (
        <div className={styles.data}>
          <div className={styles.box}>
            <h2>Name</h2>
            <p>
              {userData.firstName} {userData.lastName}
            </p>
          </div>
          <div className={styles.box}>
            <h2>Email</h2>
            <p>{userData.email}</p>
            <button className={styles.button} onClick={openEmailPopup_1}>
              Change E-mail
            </button>
          </div>
          <div className={styles.box}>
            <h2>Group Code</h2>
            <p className={styles.textinbox}>{userGroup}</p>
          </div>
          <div className={styles.box}>
            <h2>Abo</h2>
            <p className={styles.textinbox}>{groupAbo}</p>
          </div>
        </div>
      )}
      {rightabo === "big" && (
        <div className={styles.boxbig}>
          <h2 className={styles.h2}>Group Employees</h2>
          <div className={styles.tableContainer}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th style={{ padding: "20px" }}>Name</th>
                  <th style={{}}>Role</th>
                  {/* comning soon <th style={{}}>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(groupEmployees) && groupEmployees.length > 0 ? (
                  groupEmployees.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee}</td>
                      <td>{employee === "Hans Müller" ? "Admin" : "Worker"}</td>
                      {/* coming soon <td>
                      <button
                        className={styles.button}
                        onClick={() => handleDeleteClick(employee)}
                      >
                        Delete
                      </button>
                      <button
                        className={styles.button}
                        onClick={() => handleDeleteClick(employee)}
                      >
                        Edit Role
                      </button>
                    </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Loading or no employees to display</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isEmailPopupOpen_1 && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Are you sure you want to change your email?</h2>
            <br></br>
            <form onSubmit={handleEmailChange}>
              <label style={{ display: "block" }}>
                New Email:
                <input
                  type="email"
                  value={email}
                  style={{ marginLeft: "15px" }}
                  onChange={handleEmailInputChange}
                  className={styles.input}
                  required
                />
                {isValid ? (
                  <span style={{ color: "green" }}>✓</span>
                ) : (
                  <span style={{ color: "red" }}>X</span>
                )}
              </label>
              <br></br>
              <label style={{ display: "block" }}>
                Confirm Email:
                <input
                  type="email"
                  style={{ marginLeft: "10px" }}
                  value={confirmEmail}
                  onChange={handleConfirmEmailChange}
                  className={styles.input}
                  required
                />
                {isMatching ? (
                  <span style={{ color: "green" }}>✓</span>
                ) : (
                  <span style={{ color: "red" }}>X</span>
                )}
                <br></br>
              </label>
              <button type="submit" className={styles.button}>
                Confirm
              </button>
              <button onClick={closeEmailPopup_1} className={styles.button}>
                Cancel
              </button>
              <br></br>
            </form>
            {message && <div className={styles.success_msg}>{message}</div>}
            {error && <div className={styles.error_msg}>{error}</div>}
            <br></br>
          </div>
        </div>
      )}
      {/* coming soon */}
      {/* 
      {isDeletePopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedEmployee}?</p>
            <button onClick={handleConfirmDelete} className={styles.button}>
              Yes
            </button>
            <button onClick={handleCancelDelete} className={styles.button}>
              No
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Profile;
