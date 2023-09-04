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

  useEffect(() => {
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
  useEffect(() => {
    const fetchGroupEmployeesData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/group/abo?group=${groupId}`
        );
        const employeesString = response.data.employee;
        const employeesArray = JSON.parse(employeesString); // Parse the string into an array
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
      <div className={styles.boxbig}>
        <h2 className={styles.h2}>Group Employees</h2>
        <div className={styles.tableContainer}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th style={{ width: "20%", padding: "20px" }}>Name</th>
                <th style={{ width: "20%" }}>Role</th>
                <th style={{ width: "20%" }}>Joined</th>
                <th style={{ width: "20%" }}>Last active</th>
                <th style={{ width: "20%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(groupEmployees) && groupEmployees.length > 0 ? (
                groupEmployees.map((employee, index) => (
                  <tr key={index}>
                    <td>{employee}</td>
                    <td>{employee === "Hans Müller" ? "CEO" : "Worker"}</td>
                    <td>20.02.2023</td>
                    <td>20.02.2023</td>
                    <td>
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
                    </td>
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
      )}
    </div>
  );
};

export default Profile;
